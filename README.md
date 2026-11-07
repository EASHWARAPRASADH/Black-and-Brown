# Black & Brown — Salon & Academy

Official website and digital booking platform for **Black & Brown Salon & Academy** located in Karaikal, Puducherry.

🌐 **Live Website:** [https://blackandbrownsalon.com](https://blackandbrownsalon.com)

---

## ✨ Features

- **Interactive 3D Hero Experience:** Responsive WebGL scene powered by Three.js & `@react-three/fiber` featuring ambient floating geometries and particle fields optimized for both desktop and mobile viewports.
- **Online Booking System:** Intuitive appointment scheduler for haircuts, hair coloring, styling, makeup, and spa treatments.
- **Academy Enrollment:** Application portal for certified cosmetology, makeup artistry, and beauty training programs.
- **Service & Gallery Showcase:** Visual catalog of salon work, styling portfolios, and academy student achievements.
- **Hostinger Mail API:** Lightweight, secure server-side PHP SMTP gateway forwarding customer inquiries directly to `admin@blackandbrownsalon.com`.
- **Print & Poster Ready:** Includes high-resolution (3000×3000 @ 300 DPI) and vector SVG QR codes for marketing standees, banners, and flyers.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Custom Luxe Theme
- **3D & Animation:** Three.js, `@react-three/fiber`, `@react-three/drei`, Motion (`framer-motion`)
- **Icons:** Lucide React
- **Backend API:** PHP 8+ (Custom SMTP mail handler with rate limiting & security filters)
- **Deployment:** Hostinger Cloud / Apache with HTTPS & HTTP/2

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EASHWARAPRASADH/Black-and-Brown.git
   cd Black-and-Brown
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── api/                    # PHP backend mail scripts
│   ├── .htaccess           # Security headers & restrictions
│   └── send-request.php    # SMTP mail handler
├── public/                 # Static public assets (favicons, manifests, etc.)
├── qr-codes/               # Print-ready vector SVG and 300 DPI QR codes
├── src/
│   ├── components/         # React UI views & 3D components
│   │   ├── Hero3DScene.tsx # Three.js responsive floating scene
│   │   ├── HomeView.tsx    # Hero section & landing content
│   │   ├── BookingModal.tsx
│   │   ├── EnrollmentModal.tsx
│   │   └── ...
│   ├── data.ts             # Service lists, pricing, and academy courses
│   ├── types.ts            # TypeScript data interfaces
│   └── main.tsx            # React application entry point
├── .htaccess               # Production routing & cache headers
├── index.html              # SEO metadata & HTML shell
├── package.json
└── vite.config.ts
```

---

## 📄 License

Proprietary © Black & Brown Salon & Academy. All rights reserved.
