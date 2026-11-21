// Central place for all site content. Edit text / images here.

export const SITE = {
  name: 'Farda Sourcing',
  email: 'info@fardasourcing.com',

  address: 'Bahria Town Phase 7, Rawalpindi, Pakistan',
  hours: 'Mon - Sat: 8:00 AM - 5:00 PM',
};

// Images live in /public/images. If a file is missing, <Img /> shows a placeholder.
export const IMAGES = {
  heroRobot: '/images/hero-robot.png',
  catAi: '/images/cat-ai-robotics.svg',
  catSmartHome: '/images/cat-smart-home.svg',
  catIndustrial: '/images/cat-industrial.svg',
  catConsumer: '/images/cat-consumer-electronics.svg',
  aboutOffice: '/image/about-office.svg',
  servicesShip: '/images/services-ship.svg',
  marketsMap: '/images/markets-map.png',
  supplierHandshake: '/images/supplier-handshake.svg',
  prodHumanoid: '/images/prod-humanoid.svg',
  prodVacuum: '/images/prod-vacuum.svg',
  prodRoboticArm: '/images/prod-robotic-arm.svg',
  prodCamera: '/images/prod-camera.svg',
  prodWearables: '/images/prod-wearables.svg',
  prodDrone: '/images/prod-drone.svg',
  prodScooter: '/images/prod-scooter.svg',
  prodHeadphones: '/images/prod-headphones.svg',
  hubShenzhen: '/images/hub-shenzhen.svg',   // Shenzhen skyline
  hubFoshan: '/images/hub-foshan.svg',     // Foshan city
  hubZhongshan: '/images/hub-zhongshan.svg',  // Zhongshan lights or city
  hubYiwu: '/images/hub-yiwu.svg',       // Yiwu market or city
  hubNingbo: '/images/hub-ningbo.svg',     // Ningbo container port
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  // { label: 'Markets', to: '/markets' },
  // { label: 'How It Works', to: '/how-it-works' },
  { label: 'Supplier', to: '/supplier' },
  { label: 'Contact', to: '/contact' },
  { label: 'Franchise', to: '/franchise' },
];

export const HERO_STATS = [
  { icon: 'users', value: '500+', label: 'Trusted Manufacturers' },
  { icon: 'globe', value: '15+', label: 'Countries Served' },
  { icon: 'package', value: '20+', label: 'Product Categories' },
  { icon: 'shield-check', value: '100%', label: 'Commitment to Quality' },
];

export const POPULAR_CATEGORIES = [
  {
    title: 'AI & Robotics',
    text: 'Intelligent robots and AI-powered solutions',
    image: IMAGES.catAi,
    to: '/products',
  },
  {
    title: 'Smart Home Technology',
    text: 'Connected devices for modern living',
    image: IMAGES.catSmartHome,
    to: '/products',
  },
  {
    title: 'Industrial Automation',
    text: 'Advanced automation solutions',
    image: IMAGES.catIndustrial,
    to: '/products',
  },
  {
    title: 'Consumer Electronics',
    text: 'Innovative electronics for everyday life',
    image: IMAGES.catConsumer,
    to: '/products',
  },
];

export const WHY_CHOOSE = [
  { icon: 'globe', title: 'Global Network', text: 'Access to verified manufacturers worldwide' },
  { icon: 'user-check', title: 'Quality Assured', text: 'Strict quality checks and product inspections' },
  { icon: 'shield-check', title: 'End-to-End Support', text: "From sourcing to delivery, we've got you covered" },
  { icon: 'trending-up', title: 'Competitive Advantage', text: 'Better pricing, better products, better business' },
];

export const ABOUT = {
  paragraphs: [
    'Farda Sourcing is an international sourcing and trading company dedicated to connecting businesses with manufacturers and innovative products worldwide.',
    'We aim to make global sourcing simple, transparent and efficient through technology, expertise and trusted partnerships.',
  ],
  storyTitle: 'Our story',
  storyParagraphs: [
    '"Farda" means tomorrow. We started Farda Sourcing because the products of tomorrow are being made in China today, but most businesses can\'t easily find, check and import them on their own.',
    'Buying from suppliers you can\'t see is risky: quotations that aren\'t comparable, samples that don\'t match production, and problems discovered only when the container is opened. We sit between buyers and manufacturers as a dependable sourcing partner. We do the research, the checking and the coordination, and we report back clearly so you can decide quickly and with confidence.',
  ],
  mission:
    'To bridge the gap between manufacturers and global markets through reliable sourcing solutions and long-term partnerships.',
  vision:
    'To become a trusted global sourcing partner, connecting innovative products with businesses across borders.',
  values: [
    'Integrity & Transparency',
    'Quality & Reliability',
    'Innovation',
    'Customer Satisfaction',
    'Long-Term Partnerships',
  ],
};

export const PRODUCT_CATEGORIES = ['All Categories', 'AI & Robotics', 'Smart Home', 'Industrial', 'Electronics', 'More'];

export const PRODUCTS = [
  { name: 'Humanoid Robots', category: 'AI & Robotics', image: IMAGES.prodHumanoid },
  { name: 'Robot Vacuum Cleaners', category: 'Smart Home', image: IMAGES.prodVacuum },
  { name: 'Industrial Robotic Arms', category: 'Industrial', image: IMAGES.prodRoboticArm },
  { name: 'Smart Security Cameras', category: 'Smart Home', image: IMAGES.prodCamera },
  { name: 'Smart Wearables', category: 'Electronics', image: IMAGES.prodWearables },
  { name: 'Drones & UAV', category: 'AI & Robotics', image: IMAGES.prodDrone },
  { name: 'EV & E-Mobility', category: 'More', image: IMAGES.prodScooter },
  { name: 'Consumer Electronics', category: 'Electronics', image: IMAGES.prodHeadphones },
];

export const SERVICES = [
  { icon: 'search', title: 'Supplier Sourcing', text: 'Find and connect with verified manufacturers.' },
  { icon: 'cart', title: 'Product Procurement', text: 'Handle negotiations, sampling and ordering.' },
  { icon: 'clipboard', title: 'Quality Inspection', text: 'Ensure products meet global quality standards.' },
  { icon: 'truck', title: 'Logistics & Shipping', text: 'Global shipping with reliable logistics partners.' },
  { icon: 'bar-chart', title: 'Market Research', text: 'Analyze trends and discover new opportunities.' },
  { icon: 'headphones', title: 'After Sales Support', text: 'Dedicated support even after delivery.' },
];

export const PROCESS_STEPS = [
  { number: '01', title: 'Share Requirements', text: 'Tell us what you need, your specs, quantity and target market.' },
  { number: '02', title: 'Supplier Identification', text: 'We find and shortlist the best manufacturers for you.' },
  { number: '03', title: 'Product Evaluation', text: 'Compare quality, price, samples and supplier capabilities.' },
  { number: '04', title: 'Procurement', text: 'We handle negotiations and coordinate your order.' },
  { number: '05', title: 'Shipping & Delivery', text: 'We arrange shipping and ensure smooth delivery.' },
];

export const MARKET_STATS = [
  { icon: 'globe', value: '15+', label: 'Countries' },
  { icon: 'smile', value: '1000+', label: 'Happy Clients' },
  { icon: 'shield-check', value: '98%', label: 'Client Retention' },
];

export const MARKET_BENEFITS = [
  { icon: 'truck', title: 'Worldwide Shipping', text: 'Secure and efficient shipping solutions.' },
  { icon: 'link', title: 'Strong Partnerships', text: 'Long-term relationships built on trust.' },
  { icon: 'globe', title: 'Local Market Understanding', text: 'We understand your market needs.' },
  { icon: 'clock', title: 'Timely Delivery', text: 'On-time delivery, every time.' },
];

export const SUPPLIER_BENEFITS = [
  'Expand your market reach globally',
  'Long-term business partnerships',
  'Fair negotiation and transparent deals',
  'Timely payments and professional support',
];

export const INQUIRY_TYPES = [
  'Product Sourcing',
  'Become a Supplier',
  'Logistics & Shipping',
  'Quality Inspection',
  'Market Research',
  'Other',
];

export const FOOTER_COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Products', to: '/products' },
      { label: 'Services', to: '/services' },
      // { label: 'Markets', to: '/markets' },
      // { label: 'How It Works', to: '/how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Become a Supplier', to: '/supplier' },
      { label: 'Blog', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms & Conditions', to: '/' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'AI & Robotics', to: '/products' },
      { label: 'Smart Home', to: '/products' },
      { label: 'Industrial Automation', to: '/products' },
      { label: 'Consumer Electronics', to: '/products' },
      { label: 'All Products', to: '/products' },
    ],
  },
];

export const SOCIAL_LINKS = [
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/fardasourcing/' },
  { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1M31Lmp3Vc/' },
  { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/fardasourcing?dmpr=MW41YzJjcTlkYnVndw==' },
  { icon: 'x', label: 'X', href: 'https://x.com' },
];
