import { ServiceCategory, ComboOffer, Course, TeamMember, Testimonial } from './types';

export const HERO_CONTENT = {
  heading: "Style, Skill, and Shine",
  subheading: "All in One Place",
  tagline: "Experience unmatched salon luxury or advance your hair and beauty career at our award-winning studio & academy."
};

export const ABOUT_STUDIO = {
  title: "Premium Experience",
  description: "Founded in 2022, Black and Brown began with a simple vision: to create a space where beauty services and education could coexist harmoniously. Our founders, Mrs. Nandhini Mohamed and Mr. Gul Mohamed, combined their expertise in styling and education to build a studio that offers the best of both worlds. What started as a small salon with two styling chairs has grown into a premier destination for beauty services and professional training. Our commitment to excellence has remained unchanged as we've expanded our offerings and welcomed talented professionals to our team."
};

export const SERVICES_PREVIEW = [
  {
    title: "Precision Cuts",
    description: "Custom haircuts tailored to personal style, facial features, and hair texture.",
    icon: "Scissors"
  },
  {
    title: "Luxury Treatments",
    description: "Premium scalp and hair rejuvenation treatments designed for restorative wellness.",
    icon: "Sparkles"
  },
  {
    title: "Color Expertise",
    description: "Master highlights, transformations, and flawless professional coloring services.",
    icon: "Palette"
  }
];

export const TRAINING_PREVIEW = {
  title: "Master Your Craft",
  description: "Comprehensive training programs for beginners and experienced stylists with intense hands-on learning, live models, and business mentorship."
};

export const STATS = [
  { value: "500+", label: "Graduates" },
  { value: "15", label: "Specialized Programs" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "11+", label: "Years Experience" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    author: "Jessica M.",
    role: "Training Graduate",
    text: "The training transformed my career completely. The instructors are true masters of their craft, and the business guidance allowed me to start my own studio within six months.",
    rating: 5
  },
  {
    author: "Michael T.",
    role: "Regular Salon Client",
    text: "Every visit is a sheer luxury experience. The stylists' attention to detail, the warm ambience, and the consistency of results always exceed expectations.",
    rating: 5
  }
];

export const CONTACT_INFO = {
  phone: "+91 63748 54329",
  email: "admin@blackandbrownsalon.com",
  address: "Above Kumaran Medical, Bharathiyar St, Kennadiyar Street, Thalatheru, Karaikal, Puducherry - 609605",
  hours: [
    { days: "Monday – Saturday", time: "9:00 AM – 8:00 PM" },
    { days: "Sunday", time: "10:00 AM – 6:00 PM" }
  ]
};

// Premium services listings with exact rupee values.
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "mens-haircuts",
    title: "Men's Haircuts",
    gender: "men",
    items: [
      { name: "Kids Haircut", price: 150, description: "Gentle cut for children up to 12 years" },
      { name: "Men’s Basic Hair Cut", price: 200, description: "Classic scissor or clipper trim and shape" },
      { name: "Men’s Advance Fading", price: 250, description: "Modern low, mid, or high skin fade with precise taper" },
      { name: "Men’s Layer Cut", price: 350, description: "Professional texturing & layered layout for longer lengths" }
    ]
  },
  {
    id: "mens-grooming",
    title: "Men's Grooming",
    gender: "men",
    items: [
      { name: "Beard Trim & Shape", price: 100, description: "Lineup with trimmers and soothing balm" },
      { name: "Beard Stylish", price: 150, description: "Signature styling custom customized to your sharp look" },
      { name: "Beard Colouring", price: 180, description: "Premium, skin-safe gray hair coverage for a youthful beard" }
    ]
  },
  {
    id: "mens-treatments",
    title: "Men's Treatments",
    gender: "men",
    items: [
      { name: "Shampoo & Conditioning", price: 150, description: "Cleanse with premium hair health formulations" },
      { name: "Head Massage + Hair Wash + Conditioning", price: 350, description: "Ultimate triple action for relief and high hair shine" },
      { name: "Coconut Oil Head Massage", price: 300, description: "Traditional soothing massage to improve scalp circulation" },
      { name: "Almond Oil Head Massage", price: 300, description: "Nourishes follicles with rich Vitamin E and essential oils" },
      { name: "Olive Oil Head Massage", price: 350, description: "Deep hydration and strength repair for dry hair structures" },
      { name: "Extra Massage (10 min)", price: 150, description: "Add-on relaxation extension using signature techniques" }
    ]
  },
  {
    id: "mens-skincare",
    title: "Men's Skin Care",
    gender: "men",
    items: [
      { name: "Face De-Tan", price: 200, description: "Gently removes sun damage & pollution for a brighter, even tone" },
      { name: "Neck De-Tan", price: 250, description: "Deep cleansing and pigment correction back & front neck" }
    ]
  },
  {
    id: "womens-threading",
    title: "Women's Threading",
    gender: "women",
    items: [
      { name: "Upper Lip Threading", price: 40, description: "Precise eyebrow alignment/threading or upper lip extraction" },
      { name: "Forehead Threading", price: 40, description: "Clean brow contouring and smooth hair removal" }
    ]
  },
  {
    id: "womens-haircuts",
    title: "Women's Haircuts",
    gender: "women",
    items: [
      { name: "Precision Cut", price: 450, description: "Premium wash, customized master haircut style & texturizing" },
      { name: "Dry Cut", price: 300, description: "Quick style adjustment on pre-washed or dry hair" },
      { name: "Bang Trim", price: 150, description: "Fringe shape correction to beautifully highlight eyes" }
    ]
  },
  {
    id: "womens-styling",
    title: "Women's Styling",
    gender: "women",
    items: [
      { name: "Blowout", price: 500, description: "High volume professional dryer finish with style lock parameters" },
      { name: "Special Occasion Style", price: 1200, description: "Formal half updo, curler style, waves, or party preparation" },
      { name: "Bridal Trial", price: 1500, description: "Comprehensive trial styling session to decide your magical look" }
    ]
  },
  {
    id: "womens-treatments",
    title: "Women's Treatments",
    gender: "women",
    items: [
      { name: "Deep Conditioning", price: 600, description: "Infuses extreme moisture back into dry, processed strands" },
      { name: "Keratin Smoothing", price: 3500, description: "Smooth frizz-free manageable look lasting up to 16 weeks" },
      { name: "Scalp Detox", price: 800, description: "Removes product buildup and purifies active follicles" }
    ]
  },
  {
    id: "womens-color",
    title: "Women's Hair Color",
    gender: "women",
    items: [
      { name: "Single Process Color", price: 1800, description: "Flawless root touch up or full single shade overlay" },
      { name: "Highlights/Lowlights", price: 2800, description: "Dimensional foils to add stunning tone contrast" },
      { name: "Balayage/Ombré", price: 4500, description: "Bespoke hand-painted freehand sweep for a gorgeous gradient" }
    ]
  },
  {
    id: "womens-facials",
    title: "Women's Facials",
    gender: "women",
    items: [
      { name: "Classic Facial", price: 800, description: "Double cleanse, gentle exfoliation, premium glow masque" },
      { name: "Enzyme Facial", price: 1200, description: "Acids and natural papaya enzymes to instantly peel off tired skin" },
      { name: "Acne Treatment", price: 1000, description: "High purifying extraction and botanical calming serums" }
    ]
  },
  {
    id: "womens-waxing",
    title: "Women's Waxing",
    gender: "women",
    items: [
      { name: "Brow Waxing", price: 120, description: "Rapid clean brow line structuring using fine organic wax" },
      { name: "Chin Waxing", price: 100, description: "Flawless hair removal for chin contours" },
      { name: "Lip Waxing", price: 80, description: "Gentle lip zone hair removal for smooth makeup setups" }
    ]
  },
  {
    id: "womens-nails",
    title: "Women's Nails",
    gender: "women",
    items: [
      { name: "Manicure", price: 450, description: "Nail shaping, cuticle treatment, massage & beautiful polish finish" },
      { name: "Pedicure", price: 550, description: "Relaxing foot soak, scrub file, massage, and nail care" },
      { name: "Nail Art", price: 300, description: "Custom hand-crafted art patterns on selected nails" }
    ]
  },
  {
    id: "womens-bridal",
    title: "Women's Bridal Services",
    gender: "women",
    items: [
      { name: "Bridal Makeup", price: 5000, description: "HD premium airbrush makeup that holds beautifully, matching flash setup" },
      { name: "Bridal Hair Styling", price: 3000, description: "Luxury traditional bun or modern curls with structural support" },
      { name: "Bridal Trial Combo", price: 2000, description: "Consultation testing layout to preview makeup and hair pairs" }
    ]
  }
];

export const COMBO_OFFERS: ComboOffer[] = [
  {
    id: "combo-1",
    name: "Combo 1: Signature Groom & Relax",
    services: ["Haircut", "Beard Trim", "Head Massage"],
    price: 400,
    originalPrice: 650
  },
  {
    id: "combo-2",
    name: "Combo 2: Revitalizing & Coverage Upgrade",
    services: ["Haircut", "Gray Hair Coverage", "De-Tan"],
    price: 750,
    originalPrice: 1050
  },
  {
    id: "combo-3",
    name: "Combo 3: Skin and Scalp Booster",
    services: ["Haircut", "De-Tan", "Head Massage"],
    price: 450,
    originalPrice: 700
  }
];

export const TRAINING_WHY = [
  {
    title: "Award-Winning Instructors",
    description: "Learn face-to-face from elite founders and master stylists with decades of international practice."
  },
  {
    title: "Hands-On Experience",
    description: "Work with real premium products on actual live models in simulated studio setups."
  },
  {
    title: "Industry-Recognized Certification",
    description: "Receive a professional academy certificate that opens employment doors globally."
  }
];

export const TRAINING_COURSES: Course[] = [
  {
    id: "fond-cut",
    title: "Foundations of Cutting",
    category: "hair",
    duration: "6 Weeks",
    description: "For absolute beginners. Master correct scissors posture, sectioning, line geometries, elevation parameters, and four fundamental shapes.",
    syllabus: ["Introduction to Hair Textures & Tools", "Geometric Sectioning Theories", "Uniform Layering & Graduations", "Live Model Client Consultation Practices"],
    image: "/img/training.jpeg"
  },
  {
    id: "adv-men-cut",
    title: "Advanced Men’s Cutting",
    category: "hair",
    duration: "4 Weeks",
    description: "For experienced barbers. Elevate your craft to master state-of-the-art skin fading, buzz trims, texturized crop styling, and hot lather close shaves.",
    syllabus: ["Fade Mechanics (Low, Mid, High, Burst)", "Clipper-Over-Comb Mastery", "Beard Sculpting & Beard Design", "Blade Handling & Hot Towel Luxury"],
    image: "/img/training2.jpeg"
  },
  {
    id: "creative-texturing",
    title: "Creative Texturing & Shags",
    category: "hair",
    duration: "3 Weeks",
    description: "Focuses on modern movement trends. Create beautiful shags, layers, curtain flows, and razor slide textures built to frame facial elements.",
    syllabus: ["Razor Sliding & Point Cut Theories", "French Styling & Volume Blow-drying", "Tension Modulation and Weight Extraction"],
    image: "/img/training3.jpeg"
  },
  {
    id: "skin-analysis",
    title: "Skin Analysis & Care Foundation",
    category: "skin",
    duration: "4 Weeks",
    description: "Understand skin biology. Analyze elasticity, oil and water balance, pore structure, acne causes, and specialized ingredient treatment guides.",
    syllabus: ["Epidermal Layer Science", "Comedone Analysis & Extraction Steps", "Botanical & Chemical Product Pairing", "Deep Tissue Face Massage Routines"],
    image: "/img/training4.jpeg"
  },
  {
    id: "adv-facial-tech",
    title: "Advanced Facial Techniques",
    category: "skin",
    duration: "3 Weeks",
    description: "Master modern aesthetic therapy. Utilize professional peels, exfoliation techniques, and luxury glow-recovery routines.",
    syllabus: ["Fruit & Acid Chemical Peelings", "Microcurrent Treatments", "Anti-Aging Facial Sculpting", "Mask Formulation and Extraction Mastery"],
    image: "/img/training5.jpeg"
  },
  {
    id: "color-theory",
    title: "Color Theory & Application",
    category: "chemical",
    duration: "5 Weeks",
    description: "The complete color playbook. Command the wheel of primary, secondary, tertiary tones, developer percentages, and total tint cover.",
    syllabus: ["The Chromatic Color Wheel Mechanics", "Oxidative vs Non-Oxidative Dyes", "Splat & Gray coverage techniques", "Formulating precise volume developer solutions"],
    image: "/img/training6.jpeg"
  },
  {
    id: "balayage-highlighting",
    title: "Balayage & Highlighting Masterclass",
    category: "chemical",
    duration: "4 Weeks",
    description: "High demand styling skills. Master foil babylights, shadow root melts, and custom freehand balayage sweeps that fade correctly.",
    syllabus: ["Freehand Sweep (Balayage) Tension", "Foil Placements and Weaving Formats", "Baby-lights, Contourees & Ombrés", "Acidic Glossing & Soft Toning"],
    image: "/img/training7.jpeg"
  },
  {
    id: "color-correction",
    title: "Aesthetic Color Correction",
    category: "chemical",
    duration: "3 Weeks",
    description: "Fix hair color disasters with extreme expertise. Remove stubborn green, transition black to blonde, and solve bands without snapping hair bond structures.",
    syllabus: ["Pre-pigmenting & Fillers formulation", "Double Lifting under high health", "Bond Multiplying technology (Olaplex systems)", "Complex neutralization blueprints"]
  },
  {
    id: "salon-bus-fund",
    title: "Salon Business Fundamentals",
    category: "business",
    duration: "2 Weeks",
    description: "Learn how to establish a high profit salon. Pricing services, managing product capital inventory, retail upselling, and employee team retention policies.",
    syllabus: ["Service Menu Pricing Blueprints", "Stock Inventory Management & Audits", "Retail Conversions at styling chairs", "Rentals vs Employment legal frameworks"]
  },
  {
    id: "salon-marketing",
    title: "Salon Marketing & Social Media",
    category: "business",
    duration: "2 Weeks",
    description: "How to bring clients in on autopilot. Shoot premium Instagram reels of hair transformations, run local ads, and manage booking pipelines.",
    syllabus: ["Lighting & Filming Hair Transformations", "Setting up local Google Maps Maps search ranking", "Instagram Growth Hooks and Reels creation", "Building automated loyal customer text sequences"]
  }
];

export const TRAINING_JOURNEY = [
  { step: "01", title: "Digital Application", text: "Submit your details, background, and career goals." },
  { step: "02", title: "Creative Interview", text: "A brief conversation with program leads to match goals." },
  { step: "03", title: "Enrollment & Kit Dispatch", text: "Secure your place and pick up your master toolkit kit." },
  { step: "04", title: "Hands-on Training", text: "Immersive lessons on actual live models inside the studio." },
  { step: "05", title: "Final Certification", text: "Showcase a graduation custom look before senior board panels." },
  { step: "06", title: "Career Placement", text: "Direct introduction to premium local salons and instructor circles." }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Mrs. Nandhini Mohamed",
    role: "Co-Founder & Master Makeup Expert",
    bio: "With our 15 years of industry experience, Mrs. Nandhini Mohamed specializes in advanced makeup art certified by Kryolan International Makeup Manufacturer Company Private Limited, serving previously as Studio Eleven Manager (Chennai).",
    image: "/img/msnandhani.jpeg"
  },
  {
    name: "Mr. Gul Mohamed",
    role: "Co-Founder & Academy Director",
    bio: "Mr. Gul Mohamed leads our training programs with innovative techniques and 7+ years experience, including 2 years as lead trainer in Naturals Training Academy (Chennai) and clinical director in 5+ professional salons around India.",
    image: "/img/gul.jpeg"
  },
  {
    name: "Pradeep",
    role: "Advisor",
    bio: "Our lead advisor in premium student career mentoring and corporate operational governance across Puducherry zones.",
    image: "/img/pradeep.jpeg"
  }
];

export const OUR_STORY = {
  text: "Founded in 2022, Black and Brown began with a simple vision: to create a space where beauty services and education could coexist harmoniously. Our founders, Mrs. Nandhini Mohamed and Mr. Gul Mohamed, combined their expertise in styling and education to build a studio that offers the best of both worlds. What started as a small salon with two styling chairs has grown into a premier destination for beauty services and professional training. Our commitment to excellence has remained unchanged as we've expanded our offerings and welcomed talented professionals to our team."
};

export const MISSION_STATEMENT = "To elevate the beauty industry through exceptional services and education, empowering individuals to express their unique style and potential.";

export const CORE_VALUES = [
  { title: "Excellence", desc: "Setting high-quality benchmarks for cut, color, skin therapy, and educational standards." },
  { title: "Inclusivity", desc: "Honoring and perfecting beauty routines across all hair textures, genders, and beauty ideals." },
  { title: "Innovation", desc: "Continuously training ourselves and adopting state-of-the-art tools and luxury salon formulations." },
  { title: "Growth", desc: "Investing deeply in our stylists' success and our students' professional life trajectories." }
];

export const FACILITIES = [
  { name: "3 Stylish Stations", desc: "Sleek, individual styling zones fully equipped with high-end premium equipment." },
  { name: "Dedicated Training Studio", desc: "A lecture-to-action space for students with live shampoo headers, color bars, and projector layouts." },
  { name: "Relaxation Lounge", desc: "Sip espresso, organic tea, and read high-end fashion press while awaiting your beauty technician." },
  { name: "Private Treatment Rooms", desc: "Quiet candlelit spaces for skincare, medical peels, and deep recovery face treatments with music." }
];
