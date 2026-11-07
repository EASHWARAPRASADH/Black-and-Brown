<?php
/**
 * Emails booking and academy form submissions to the salon mailbox over SMTP.
 *
 * The mailbox password is NOT in this file. It is read from bb-mail-config.php,
 * which lives outside public_html. See server/bb-mail-config.example.php.
 *
 * Written for PHP 7.4+ with no extra libraries.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kolkata');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const BOOKING_TIMES = ['09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];
const INTERVIEW_TIMES = ['Morning (10:00 AM)', 'Lunch Hour (01:00 PM)', 'Afternoon (03:00 PM)', 'Evening (05:30 PM)'];
const MAX_BODY_BYTES = 20000;

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function load_config(): ?array
{
    // __DIR__ is public_html/api, so the first path is next to public_html.
    $paths = [dirname(__DIR__, 2) . '/bb-mail-config.php', __DIR__ . '/mail-config.php'];
    foreach ($paths as $path) {
        if (@is_file($path) && @is_readable($path)) {
            $config = require $path;
            if (is_array($config) && !empty($config['smtp_user']) && !empty($config['smtp_pass'])) {
                return $config;
            }
        }
    }
    return null;
}

/** Removes control characters so a value cannot add email headers. */
function clean_line($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = (string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    return limit_length(trim($value), $maxLength);
}

/** Like clean_line, but keeps line breaks for notes and goals. */
function clean_text($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = (string) preg_replace('/[\x00-\x09\x0B-\x1F\x7F]+/u', ' ', $value);
    return limit_length(trim($value), $maxLength);
}

function limit_length(string $value, int $maxLength): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength, 'UTF-8') : substr($value, 0, $maxLength);
}

function valid_phone(string $phone): bool
{
    $digits = strlen((string) preg_replace('/\D/', '', $phone));
    return preg_match('/^[+\d\s()-]+$/', $phone) === 1 && $digits >= 10 && $digits <= 13;
}

/** Accepts YYYY-MM-DD from today up to one year ahead (India time). */
function valid_future_date(string $date): bool
{
    if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date, $m) !== 1 || !checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
        return false;
    }
    return $date >= date('Y-m-d') && $date <= date('Y-m-d', strtotime('+1 year'));
}

function pretty_date(string $date): string
{
    return date('D, j M Y', (int) strtotime($date));
}

/** Counts a hit against a limit. If the counter cannot be stored, the request is allowed. */
function within_limit(string $key, int $limit, int $windowSeconds): bool
{
    $file = sys_get_temp_dir() . '/bb_rate_' . sha1($key);
    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return true;
    }
    flock($handle, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($handle), true);
    $now = time();
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], function ($t) use ($now, $windowSeconds) {
        return is_int($t) && $t > $now - $windowSeconds;
    }));
    $allowed = count($hits) < $limit;
    if ($allowed) {
        $hits[] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, (string) json_encode($hits));
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}

function client_ip(): string
{
    $forwarded = (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
    if ($forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function smtp_expect($socket, array $codes, string $step): void
{
    $response = '';
    while (($line = fgets($socket, 1024)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }
    if (!in_array((int) substr($response, 0, 3), $codes, true)) {
        throw new RuntimeException("SMTP {$step} failed: " . trim(substr($response, 0, 120)));
    }
}

function smtp_command($socket, string $command, array $codes, string $step): void
{
    fwrite($socket, $command . "\r\n");
    smtp_expect($socket, $codes, $step);
}

function send_mail(array $config, string $replyTo, string $subject, string $body): void
{
    $user = (string) $config['smtp_user'];
    $to = (string) ($config['mail_to'] ?? $user);
    $host = (string) ($config['smtp_host'] ?? 'smtp.hostinger.com');
    $port = (int) ($config['smtp_port'] ?? 465);
    $scheme = (string) ($config['smtp_scheme'] ?? 'ssl');

    $socket = @stream_socket_client("{$scheme}://{$host}:{$port}", $errorCode, $errorMessage, 10);
    if ($socket === false) {
        throw new RuntimeException("SMTP connect failed: {$errorMessage}");
    }
    stream_set_timeout($socket, 10);

    try {
        smtp_expect($socket, [220], 'greeting');
        smtp_command($socket, 'EHLO blackandbrownsalon.com', [250], 'EHLO');
        smtp_command($socket, 'AUTH LOGIN', [334], 'AUTH');
        smtp_command($socket, base64_encode($user), [334], 'AUTH user');
        smtp_command($socket, base64_encode((string) $config['smtp_pass']), [235], 'AUTH password');
        smtp_command($socket, "MAIL FROM:<{$user}>", [250], 'MAIL FROM');
        smtp_command($socket, "RCPT TO:<{$to}>", [250, 251], 'RCPT TO');
        smtp_command($socket, 'DATA', [354], 'DATA');

        $headers = [
            'Date: ' . date('r'),
            "From: \"Black & Brown Website\" <{$user}>",
            "To: <{$to}>",
            "Reply-To: <{$replyTo}>",
            'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@blackandbrownsalon.com>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
        ];
        // Base64 lines never start with a dot, so no SMTP dot-stuffing is needed.
        $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body), 76, "\r\n");
        fwrite($socket, $message . ".\r\n");
        smtp_expect($socket, [250], 'message');
        fwrite($socket, "QUIT\r\n");
    } finally {
        fclose($socket);
    }
}

/** Returns [subject, body], or null if the submission is invalid. */
function build_email(array $data): ?array
{
    $type = $data['type'] ?? '';
    $name = clean_line($data['name'] ?? '', 100);
    $email = clean_line($data['email'] ?? '', 254);
    $phone = clean_line($data['phone'] ?? '', 30);
    $date = clean_line($data['date'] ?? '', 10);
    $time = clean_line($data['time'] ?? '', 40);
    $ref = clean_line($data['ref'] ?? '', 12);

    if (preg_match('/^BBA?-\d{4,6}$/', $ref) !== 1) {
        $ref = 'BB-' . random_int(100000, 999999);
    }
    if (strlen($name) < 2 || filter_var($email, FILTER_VALIDATE_EMAIL) === false || !valid_phone($phone) || !valid_future_date($date)) {
        return null;
    }

    $contact = "Ref: {$ref}\nName: {$name}\nPhone: {$phone}\nEmail: {$email}\n\n";
    $footer = "\n\nReply to this email to contact the customer directly.\nSent from the blackandbrownsalon.com website.";

    if ($type === 'booking') {
        if (!in_array($time, BOOKING_TIMES, true)) {
            return null;
        }
        $lines = [];
        $total = 0;
        $services = is_array($data['services'] ?? null) ? array_slice($data['services'], 0, 30) : [];
        foreach ($services as $service) {
            $serviceName = clean_line(is_array($service) ? ($service['name'] ?? '') : '', 120);
            $price = is_array($service) && is_numeric($service['price'] ?? null) ? max(0, (int) $service['price']) : 0;
            if ($serviceName !== '') {
                $lines[] = "• {$serviceName} — ₹{$price}";
                $total += $price;
            }
        }
        $servicesText = $lines ? implode("\n", $lines) : '• To be decided at the chair';
        $totalText = $total > 0 ? "₹{$total}" : 'To be decided at the chair';
        $stylist = clean_line($data['stylist'] ?? '', 100) ?: 'Any Stylist';
        $notes = clean_text($data['notes'] ?? '', 1000) ?: 'None';

        return [
            "New Booking Request {$ref} — {$name} — " . pretty_date($date) . " {$time}",
            "A customer requested an appointment. Please contact them to confirm the slot.\n\n{$contact}" .
                'Date: ' . pretty_date($date) . "\nTime: {$time}\nStylist: {$stylist}\n\n" .
                "Services:\n{$servicesText}\n\nEstimated total: {$totalText}\n\nNotes: {$notes}{$footer}",
        ];
    }

    if ($type === 'enrollment') {
        if (!in_array($time, INTERVIEW_TIMES, true)) {
            return null;
        }
        $course = clean_line($data['course'] ?? '', 120) ?: 'To be discussed';
        $duration = clean_line($data['duration'] ?? '', 40);
        $experience = clean_line($data['experience'] ?? '', 80) ?: 'Not given';
        $goals = clean_text($data['goals'] ?? '', 1000) ?: 'None provided';

        return [
            "New Academy Application {$ref} — {$name} — {$course}",
            "A student applied to the academy. Please contact them to confirm the interview.\n\n{$contact}" .
                "Course: {$course}" . ($duration !== '' ? " ({$duration})" : '') . "\nExperience: {$experience}\n\n" .
                'Preferred interview date: ' . pretty_date($date) . "\nPreferred interview time: {$time}\n\n" .
                "Career goals: {$goals}{$footer}",
        ];
    }

    return null;
}

// ---------- Request handling ----------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$config = load_config();
if ($config === null) {
    error_log('send-request: mail config missing or incomplete');
    respond(503, ['ok' => false, 'error' => 'not_configured']);
}

$allowedOrigins = array_merge(
    ['https://blackandbrownsalon.com', 'https://www.blackandbrownsalon.com'],
    (array) ($config['extra_allowed_origins'] ?? [])
);
if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
}
if (stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== 0) {
    respond(415, ['ok' => false, 'error' => 'unsupported_type']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

// Bots fill the hidden "website" field. Pretend success and send nothing.
if (!empty($data['website'])) {
    respond(200, ['ok' => true]);
}

$email = build_email($data);
if ($email === null) {
    respond(422, ['ok' => false, 'error' => 'invalid_fields']);
}

$perIpLimit = (int) ($config['limit_per_ip'] ?? 5);
$globalLimit = (int) ($config['limit_per_hour'] ?? 60);
if (!within_limit('ip:' . client_ip(), $perIpLimit, 600) || !within_limit('global', $globalLimit, 3600)) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

try {
    send_mail($config, clean_line($data['email'], 254), $email[0], $email[1]);
} catch (Throwable $e) {
    error_log('send-request: ' . $e->getMessage());
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}

respond(200, ['ok' => true]);
