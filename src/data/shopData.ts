// FILE PATH: src/data/shopData.ts
// Place this file at: src/data/shopData.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'NGN' | 'CAD';
  country: 'nigeria' | 'canada';
  category: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  country: 'nigeria' | 'canada';
  items: Array<CartItem>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// ─── NIGERIA PRODUCTS ───────────────────────────────────────────────────────────

export const nigeriaProducts: Product[] = [
  // ── Oil & Gas Supplies ──
  {
    id: 'ng-001',
    name: 'Industrial Safety Helmet',
    description:
      'ANSI-certified hard hat suitable for oil field and construction site use. UV-resistant shell with comfortable inner suspension system. Meets ANSI/ISEA Z89.1 Type I Class E standards.',
    price: 18500,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/71h1MXoNyZL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 128,
    createdAt: '2024-11-01',
  },
  {
    id: 'ng-002',
    name: 'Steel-Toed Safety Boots',
    description:
      'Heavy-duty protective footwear with puncture-resistant midsole and oil-resistant outsole. Meets ISO 20345 S3 standard. Waterproof leather upper with cushioned insole.',
    price: 42000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/71AqYoSS4BL._AC_UX695_.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 84,
    createdAt: '2024-11-10',
  },
  {
    id: 'ng-009',
    name: 'PPE Kit – Full Set',
    description:
      'Complete personal protective equipment kit: helmet, gloves, goggles, coverall, and steel-toed boots. Oil-field ready. Meets ANSI, CE, and ISO standards.',
    price: 95000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/81NxSVkuSJL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 53,
    createdAt: '2024-10-25',
  },
  {
    id: 'ng-011',
    name: 'Gas Leak Detector',
    description:
      'Portable combustible gas sniffer with audible and visual alarm. Detects LPG, methane, propane, and natural gas. 12-inch flexible sensor tip. Auto power-off function.',
    price: 28500,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/61pKbgf7AFL._AC_SL1000_.jpg',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 77,
    createdAt: '2024-11-14',
  },
  {
    id: 'ng-012',
    name: 'Chemical Resistant Gloves (5-Pack)',
    description:
      'Heavy-duty nitrile gloves rated for petroleum, acids, and solvents. 18-mil thickness. Extended 12-inch cuff for forearm protection. One-size-fits-most.',
    price: 12500,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/71lXRCBKMPL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 41,
    createdAt: '2024-11-20',
  },
  {
    id: 'ng-013',
    name: 'Fire-Resistant Coverall',
    description:
      'Nomex IIIA arc flash and flame-resistant coverall. 4.5 oz fabric, rated HRC 2 (8 cal/cm²). Snap front closure with chest and leg pockets. NFPA 70E compliant.',
    price: 67000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/51a3jnBB7ZL._AC_SX679_.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 35,
    createdAt: '2024-11-22',
  },
  {
    id: 'ng-014',
    name: 'Pipe Wrench Set (3-Piece)',
    description:
      'Heavy-duty cast iron pipe wrenches: 10-inch, 14-inch, and 18-inch. Replaceable hook and heel jaws. Ideal for oil pipeline maintenance and plumbing work.',
    price: 34000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Oil & Gas Supplies',
    image:
      'https://m.media-amazon.com/images/I/71kNHcubAnL._AC_SL1500_.jpg',
    inStock: false,
    featured: false,
    rating: 4.5,
    reviews: 29,
    createdAt: '2024-10-30',
  },

  // ── Construction Materials ──
  {
    id: 'ng-003',
    name: 'Portland Cement (50kg Bag)',
    description:
      'Premium grade Portland cement suitable for all construction applications. Consistent quality and superior compressive strength. Ideal for concrete, mortar, and rendering.',
    price: 9800,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/51W1A9aBqVL._AC_SL1000_.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 210,
    createdAt: '2024-10-15',
  },
  {
    id: 'ng-004',
    name: 'Reinforced Steel Rods (12mm × 6m)',
    description:
      'High-tensile deformed steel bars for reinforced concrete structures. Grade 60, ASTM A615 compliant. Sold per bundle of 10 rods. Superior bonding with concrete.',
    price: 87000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/41SXkKXbxQL._AC_.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 62,
    createdAt: '2024-10-20',
  },
  {
    id: 'ng-010',
    name: 'Interlocking Floor Tiles (Box of 30)',
    description:
      'Heavy-duty rubber interlocking tiles, 30-pack, 1m² coverage. Ideal for warehouses, garages, and commercial floors. Slip-resistant surface, easy peel-and-lay installation.',
    price: 25000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/81R1NNDSMxL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.2,
    reviews: 29,
    createdAt: '2024-10-18',
  },
  {
    id: 'ng-015',
    name: 'Hand Drill (850W Corded)',
    description:
      'Powerful 850W electric hand drill with keyless chuck (13mm). Variable speed trigger, reverse function. Comes with carrying case and 6-piece drill bit set.',
    price: 22000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/71BPGJMSzVL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 193,
    createdAt: '2024-11-01',
  },
  {
    id: 'ng-016',
    name: 'Concrete Mixer (140L)',
    description:
      '140-litre tilting drum electric concrete mixer, 550W motor. Robust steel frame with pneumatic wheels for easy site mobility. Mixes concrete, mortar, and plaster.',
    price: 145000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/51bdHnA0LoL._AC_SL1000_.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 47,
    createdAt: '2024-10-10',
  },
  {
    id: 'ng-017',
    name: 'PVC Pipes Bundle (3-inch × 6m, 5-Pack)',
    description:
      'Schedule 40 PVC pressure pipes, 3-inch diameter, 6-metre length. 5-piece bundle. Suitable for plumbing, drainage, and irrigation systems. SON certified.',
    price: 38000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/41tJ3UQAGML._AC_.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 56,
    createdAt: '2024-11-05',
  },
  {
    id: 'ng-018',
    name: 'Paint Sprayer (1200W HVLP)',
    description:
      'High-volume low-pressure paint sprayer with 1200W motor and 1.3L container. Adjustable spray pattern (round/flat/horizontal). Ideal for walls, fences, and furniture.',
    price: 31000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/71q+BVFATFL._AC_SL1500_.jpg',
    inStock: false,
    featured: false,
    rating: 4.1,
    reviews: 38,
    createdAt: '2024-11-18',
  },

  // ── General Commerce ──
  {
    id: 'ng-005',
    name: 'Solar Power Inverter (2.5KVA)',
    description:
      'Pure sine wave inverter with built-in MPPT solar charge controller. 24V input, 2500VA output. Ideal for homes and small businesses. LCD display, auto-restart after overload.',
    price: 185000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/71ySXhNKlNL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.4,
    reviews: 97,
    createdAt: '2024-11-05',
  },
  {
    id: 'ng-006',
    name: 'Industrial Generator (10KVA)',
    description:
      'Three-phase diesel generator with automatic voltage regulation. Low fuel consumption engine. Electric start, AVR included. Suitable for SMEs and commercial facilities.',
    price: 1250000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/51JiNRpyCBL._AC_SL1024_.jpg',
    inStock: false,
    featured: false,
    rating: 4.9,
    reviews: 45,
    createdAt: '2024-09-30',
  },
  {
    id: 'ng-019',
    name: 'Commercial Water Pump (1.5HP)',
    description:
      'Self-priming centrifugal water pump, 1.5HP motor, max flow 3000 L/hr. Ideal for boreholes, wells, and overhead tank filling. Corrosion-resistant impeller.',
    price: 58000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/71dfzaJSP-L._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 112,
    createdAt: '2024-10-28',
  },
  {
    id: 'ng-020',
    name: 'Standing Fan (18-Inch Industrial)',
    description:
      'Heavy-duty 18-inch 3-speed industrial standing fan. 5-blade design for maximum airflow. 360° oscillation, adjustable height (115–140cm). Suitable for factories and warehouses.',
    price: 21500,
    currency: 'NGN',
    country: 'nigeria',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/61W13VpfRGL._AC_SL1200_.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 88,
    createdAt: '2024-11-12',
  },
  {
    id: 'ng-021',
    name: 'CCTV Camera Kit (4-Channel)',
    description:
      '4-channel DVR security kit with four 2MP HD cameras. Night vision up to 20m, IP66 weatherproof. 1TB HDD included. Remote viewing via mobile app.',
    price: 98000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/71rQMeVLGOL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 134,
    createdAt: '2024-11-02',
  },

  // ── E-Commerce Goods ──
  {
    id: 'ng-007',
    name: 'Wireless Barcode Scanner',
    description:
      'Bluetooth 2D barcode reader compatible with Android, iOS, and Windows POS systems. 30-hour battery life. 100m wireless range. Reads QR codes and all 1D barcodes.',
    price: 32000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'E-Commerce Goods',
    image:
      'https://m.media-amazon.com/images/I/71gxDqDdXDL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 38,
    createdAt: '2024-11-12',
  },
  {
    id: 'ng-008',
    name: 'Thermal Receipt Printer',
    description:
      '80mm direct thermal printer with USB & Bluetooth connectivity. Fast 250mm/s print speed, auto-cutter included. Compatible with ESC/POS. Ideal for retail and restaurant POS.',
    price: 58000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'E-Commerce Goods',
    image:
      'https://m.media-amazon.com/images/I/71MnXCOm3AL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 71,
    createdAt: '2024-11-08',
  },
  {
    id: 'ng-022',
    name: 'POS Terminal (Android)',
    description:
      'Smart Android POS terminal with built-in receipt printer, NFC, QR scanner, and 4G SIM support. 5.5-inch touchscreen, 8-hour battery. Supports Paystack, Flutterwave, and bank apps.',
    price: 185000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'E-Commerce Goods',
    image:
      'https://m.media-amazon.com/images/I/61QMYQ4GKBL._AC_SL1000_.jpg',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 62,
    createdAt: '2024-11-15',
  },
  {
    id: 'ng-023',
    name: 'Label Maker & Printer',
    description:
      'Desktop Bluetooth label printer compatible with iOS/Android apps. Prints 20–58mm labels at 203 DPI. No ink needed (direct thermal). Great for inventory, barcodes, and shipping labels.',
    price: 26500,
    currency: 'NGN',
    country: 'nigeria',
    category: 'E-Commerce Goods',
    image:
      'https://m.media-amazon.com/images/I/71WGkBibz2L._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 49,
    createdAt: '2024-11-10',
  },
  {
    id: 'ng-024',
    name: 'Digital Weighing Scale (150kg)',
    description:
      'Electronic platform scale with 150kg capacity and 50g precision. Large LED display, tare function. AC/battery dual power. Ideal for market stalls, logistics, and warehouses.',
    price: 19500,
    currency: 'NGN',
    country: 'nigeria',
    category: 'E-Commerce Goods',
    image:
      'https://m.media-amazon.com/images/I/61bgNxhxKBL._AC_SL1200_.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 93,
    createdAt: '2024-11-06',
  },
  {
    id: 'ng-025',
    name: 'Cash Drawer (RJ-11 USB)',
    description:
      'Steel cash drawer with 4 bill and 8 coin compartments. RJ-11 connection compatible with most POS systems. Includes media slot and security lock. 41cm × 41cm footprint.',
    price: 23000,
    currency: 'NGN',
    country: 'nigeria',
    category: 'E-Commerce Goods',
    image:
      'https://m.media-amazon.com/images/I/71XM2PBBQOL._AC_SL1500_.jpg',
    inStock: false,
    featured: false,
    rating: 4.2,
    reviews: 27,
    createdAt: '2024-10-22',
  },
];

// ─── CANADA PRODUCTS ────────────────────────────────────────────────────────────

export const canadaProducts: Product[] = [
  // ── Mining Equipment ──
  {
    id: 'ca-001',
    name: 'Diamond Core Drill Bit (150mm)',
    description:
      'Professional-grade diamond core bit for concrete, granite, and masonry. Laser-welded segments for long life. Works with standard SDS-Plus and rotary drill rigs.',
    price: 189,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/71ABNHqxwRL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 92,
    createdAt: '2024-11-01',
  },
  {
    id: 'ca-002',
    name: 'Hydraulic Rock Splitter',
    description:
      'Portable hydraulic rock and concrete splitter. 500-ton splitting force. No dust, no vibration, no noise. Eco-friendly alternative to drilling and blasting.',
    price: 3499,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/61kV3JBKGBL._AC_SL1000_.jpg',
    inStock: true,
    featured: false,
    rating: 4.9,
    reviews: 34,
    createdAt: '2024-10-22',
  },
  {
    id: 'ca-009',
    name: 'Ground Penetrating Radar Unit',
    description:
      'Portable GPR system for underground utility detection and geological surveys. 400MHz antenna included. Real-time data logging with GPS tagging.',
    price: 8950,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/61R5-Wj3MmL._AC_SL1000_.jpg',
    inStock: false,
    featured: false,
    rating: 4.9,
    reviews: 21,
    createdAt: '2024-09-28',
  },
  {
    id: 'ca-011',
    name: 'Rock Core Sample Tray (10-Unit Set)',
    description:
      'Durable corrugated plastic rock core trays, each 1m long with 5 rows. Stackable and labelled with depth markers. Standard for geological and mining core logging.',
    price: 145,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/51lFoVIHJeL._AC_.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 18,
    createdAt: '2024-11-05',
  },
  {
    id: 'ca-012',
    name: 'Portable XRF Mineral Analyzer',
    description:
      'Handheld X-ray fluorescence analyser for real-time elemental analysis of rocks, soil, and metals on-site. Measures 25+ elements. Battery-powered with USB data export.',
    price: 12500,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/61Sgg4W28uL._AC_SL1000_.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 14,
    createdAt: '2024-10-08',
  },
  {
    id: 'ca-013',
    name: 'Underground Mining Light (LED)',
    description:
      'Intrinsically safe ATEX-certified LED cap lamp. 1500-lumen output, 16-hour burn time. IP68 waterproof. Meets CSA M422 standard. Tilt-adjustable beam head.',
    price: 219,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/61pq+E6+a2L._AC_SL1000_.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 63,
    createdAt: '2024-11-10',
  },
  {
    id: 'ca-014',
    name: 'Rotary Hammer Drill (SDS-Max, 1500W)',
    description:
      'Heavy-duty 1500W SDS-Max rotary hammer for core drilling and chiselling in reinforced concrete. 3 modes: drill, hammer drill, chiselling. Includes 6-piece SDS-Max bit set.',
    price: 649,
    currency: 'CAD',
    country: 'canada',
    category: 'Mining Equipment',
    image:
      'https://m.media-amazon.com/images/I/71t5gsPBe5L._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 88,
    createdAt: '2024-10-31',
  },

  // ── Construction Materials ──
  {
    id: 'ca-003',
    name: 'Structural Steel I-Beam (W8×31)',
    description:
      'ASTM A992 wide flange I-beam, 20ft length. Certified for structural applications. Mill test reports available. Ideal for commercial construction and heavy framing.',
    price: 765,
    currency: 'CAD',
    country: 'canada',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/61mvGfcmNlL._AC_SL1200_.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 57,
    createdAt: '2024-10-15',
  },
  {
    id: 'ca-004',
    name: 'Insulated Concrete Forms (ICF) Pack',
    description:
      'EPS foam forms for energy-efficient concrete walls. R-22 insulation value. Covers 75 sq ft per pack. Snap-together system, no adhesive required. CSA A440 compatible.',
    price: 245,
    currency: 'CAD',
    country: 'canada',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/51GkVHMqA2L._AC_.jpg',
    inStock: false,
    featured: false,
    rating: 4.5,
    reviews: 41,
    createdAt: '2024-11-03',
  },
  {
    id: 'ca-015',
    name: 'Cordless Framing Nailer (21°)',
    description:
      'Brushless 21° plastic collated framing nailer, 18V Li-Ion. Drives 2–3.5-inch framing nails. Tool-free depth adjustment, no-mar tip. Fires in sequential or contact mode.',
    price: 429,
    currency: 'CAD',
    country: 'canada',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/81ufF04SSEL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 204,
    createdAt: '2024-11-08',
  },
  {
    id: 'ca-016',
    name: 'Concrete Vibrator (Electric, 1.5HP)',
    description:
      'Electric concrete vibrator with 1.5HP motor and 35mm flexible poker. Vibration frequency 12,000 VPM for optimal air-bubble removal. 6m flexible shaft included.',
    price: 389,
    currency: 'CAD',
    country: 'canada',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/61DGYlzBxuL._AC_SL1200_.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 36,
    createdAt: '2024-10-25',
  },
  {
    id: 'ca-017',
    name: 'Fiberglass Ladder (8-Ft, 300lb)',
    description:
      'OSHA-compliant fibreglass step ladder, 8-foot (2.4m), 300lb (136kg) rated Type IA. Non-conductive — safe for electrical work. Wide-spread bracing, slip-resistant feet.',
    price: 189,
    currency: 'CAD',
    country: 'canada',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/61XM+I38TBL._AC_SL1000_.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 312,
    createdAt: '2024-11-01',
  },
  {
    id: 'ca-018',
    name: 'Laser Level (360° Self-Levelling)',
    description:
      'Green beam 360° self-levelling cross-line laser. ±3mm/10m accuracy. 50m range (100m with receiver). Magnetic pivoting base included. IP54 dust and splash resistant.',
    price: 249,
    currency: 'CAD',
    country: 'canada',
    category: 'Construction Materials',
    image:
      'https://m.media-amazon.com/images/I/71tqAaRTLRL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 178,
    createdAt: '2024-10-20',
  },

  // ── Industrial Supplies ──
  {
    id: 'ca-005',
    name: 'Industrial Air Compressor (60-Gal)',
    description:
      'Two-stage cast iron pump, 175 PSI max pressure, 60-gallon tank. 5.7 SCFM @90 PSI. Ideal for commercial workshops, auto shops, and pneumatic tools.',
    price: 1299,
    currency: 'CAD',
    country: 'canada',
    category: 'Industrial Supplies',
    image:
      'https://m.media-amazon.com/images/I/61-1CbKWCRL._AC_SL1000_.jpg',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 88,
    createdAt: '2024-11-07',
  },
  {
    id: 'ca-006',
    name: 'Arc Welding Machine (250A MIG/MMA)',
    description:
      'Professional MIG/MMA welder with digital display. Dual voltage 110V/220V auto-detection. Synergic control for easy parameter setting. Includes ground clamp and electrode holder.',
    price: 589,
    currency: 'CAD',
    country: 'canada',
    category: 'Industrial Supplies',
    image:
      'https://m.media-amazon.com/images/I/71LYi+HJm9L._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 116,
    createdAt: '2024-10-30',
  },
  {
    id: 'ca-010',
    name: 'Heavy-Duty Work Gloves (12-Pack)',
    description:
      'Cut-resistant Level A4 gloves with latex foam grip. Meets ANSI/ISEA 105-2016. Ideal for construction, mining, and material handling. Machine washable.',
    price: 89,
    currency: 'CAD',
    country: 'canada',
    category: 'Industrial Supplies',
    image:
      'https://m.media-amazon.com/images/I/81K-EaVjSdL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 142,
    createdAt: '2024-11-11',
  },
  {
    id: 'ca-019',
    name: 'Industrial Safety Harness (Full Body)',
    description:
      'ANSI Z359.11 Class III full body fall arrest harness. Dorsal and sternal D-rings. Padded shoulder and leg straps. Tool loop and chest strap. Fits chest 32–60 inches.',
    price: 129,
    currency: 'CAD',
    country: 'canada',
    category: 'Industrial Supplies',
    image:
      'https://m.media-amazon.com/images/I/71+jqKo7wLL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 95,
    createdAt: '2024-11-09',
  },
  {
    id: 'ca-020',
    name: 'Cordless Angle Grinder (7-Inch, 60V)',
    description:
      'Heavy-duty 60V brushless cordless angle grinder with 7-inch disc. Kickback Brake and overload protection. Electronic brake stops disc in under 2 seconds. Tool-free guard.',
    price: 379,
    currency: 'CAD',
    country: 'canada',
    category: 'Industrial Supplies',
    image:
      'https://m.media-amazon.com/images/I/71HtOwWLIoL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 167,
    createdAt: '2024-10-18',
  },
  {
    id: 'ca-021',
    name: 'Pipe Threading Machine (1/2–2 inch)',
    description:
      'Electric automatic pipe threader for 1/2–2 inch pipes. 38 RPM, forward/reverse operation. Includes 4 die heads, pipe cutter, reamer, and oil reservoir. 110V, 1100W.',
    price: 1199,
    currency: 'CAD',
    country: 'canada',
    category: 'Industrial Supplies',
    image:
      'https://m.media-amazon.com/images/I/61nS-7dVIgL._AC_SL1000_.jpg',
    inStock: false,
    featured: false,
    rating: 4.6,
    reviews: 29,
    createdAt: '2024-10-05',
  },

  // ── General Commerce ──
  {
    id: 'ca-007',
    name: 'Industrial Shelving Unit (5-Tier)',
    description:
      'Heavy-duty boltless steel shelving, 2000 lb capacity per shelf. Adjustable shelf heights at 1.5-inch increments. Easy tool-free assembly. 72"H × 48"W × 18"D.',
    price: 319,
    currency: 'CAD',
    country: 'canada',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/81UWYBEEKoL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 63,
    createdAt: '2024-11-09',
  },
  {
    id: 'ca-008',
    name: 'Commercial Pallet Jack (2.5T)',
    description:
      'Manual hydraulic pallet truck with 2500kg load capacity. Ergonomic loop handle with built-in release lever. 1220×685mm fork size. Polyurethane wheels for smooth operation.',
    price: 429,
    currency: 'CAD',
    country: 'canada',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/61Yv4GEZFuL._AC_SL1500_.jpg',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 77,
    createdAt: '2024-10-12',
  },
  {
    id: 'ca-022',
    name: 'Forklift Signal Light (Blue Spot)',
    description:
      'Blue LED forklift warning spotlight, 10W, 10–80V DC. Projects a visible blue circle 3–5m ahead of forklifts to alert pedestrians. IP67 waterproof. Vibration-resistant housing.',
    price: 79,
    currency: 'CAD',
    country: 'canada',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/51pnPWD1aWL._AC_.jpg',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 54,
    createdAt: '2024-11-14',
  },
  {
    id: 'ca-023',
    name: 'Commercial Chest Freezer (14 Cu Ft)',
    description:
      'Energy Star certified 14 cu ft chest freezer. Temperature range -12°C to -28°C. Removable basket, power-on indicator. Suitable for restaurants, retail, and cold storage.',
    price: 649,
    currency: 'CAD',
    country: 'canada',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/71yK0X1BQOL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 201,
    createdAt: '2024-10-30',
  },
  {
    id: 'ca-024',
    name: 'Label Printer + Barcode Scanner Bundle',
    description:
      'Desktop barcode label printer (203 DPI, USB/LAN) bundled with a USB wired barcode scanner. Prints 1–4 inch labels. Compatible with Windows/Mac and all major WMS software.',
    price: 249,
    currency: 'CAD',
    country: 'canada',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/71DwYfbxP8L._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 39,
    createdAt: '2024-11-06',
  },
  {
    id: 'ca-025',
    name: 'Outdoor Storage Cabinet (72-Inch)',
    description:
      'Heavy-gauge steel outdoor storage cabinet, 72"H × 36"W. 4 adjustable shelves, lockable double-door. Weather-resistant powder-coat finish. Ideal for garages and warehouses.',
    price: 529,
    currency: 'CAD',
    country: 'canada',
    category: 'General Commerce',
    image:
      'https://m.media-amazon.com/images/I/71KYrWtBpvL._AC_SL1500_.jpg',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 88,
    createdAt: '2024-10-14',
  },
];

// ─── DUMMY ORDERS ────────────────────────────────────────────────────────────────

export const dummyOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerName: 'Emeka Okafor',
    customerEmail: 'emeka.okafor@email.com',
    country: 'nigeria',
    items: [
      { ...nigeriaProducts.find(p => p.id === 'ng-001')!, quantity: 2 },
      { ...nigeriaProducts.find(p => p.id === 'ng-003')!, quantity: 5 },
    ],
    total: 86000,
    status: 'delivered',
    date: '2024-11-14',
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Fatima Bello',
    customerEmail: 'fatima.bello@email.com',
    country: 'nigeria',
    items: [{ ...nigeriaProducts.find(p => p.id === 'ng-005')!, quantity: 1 }],
    total: 185000,
    status: 'shipped',
    date: '2024-11-16',
  },
  {
    id: 'ORD-2024-003',
    customerName: 'James Adeyemi',
    customerEmail: 'james.a@email.com',
    country: 'nigeria',
    items: [
      { ...nigeriaProducts.find(p => p.id === 'ng-008')!, quantity: 1 },
      { ...nigeriaProducts.find(p => p.id === 'ng-007')!, quantity: 1 },
    ],
    total: 90000,
    status: 'processing',
    date: '2024-11-17',
  },
  {
    id: 'ORD-2024-007',
    customerName: 'Chidi Nwosu',
    customerEmail: 'chidi.nwosu@email.com',
    country: 'nigeria',
    items: [
      { ...nigeriaProducts.find(p => p.id === 'ng-022')!, quantity: 1 },
      { ...nigeriaProducts.find(p => p.id === 'ng-023')!, quantity: 2 },
    ],
    total: 238000,
    status: 'pending',
    date: '2024-11-19',
  },
  {
    id: 'ORD-2024-008',
    customerName: 'Aisha Mohammed',
    customerEmail: 'aisha.m@email.com',
    country: 'nigeria',
    items: [
      { ...nigeriaProducts.find(p => p.id === 'ng-019')!, quantity: 1 },
      { ...nigeriaProducts.find(p => p.id === 'ng-021')!, quantity: 1 },
    ],
    total: 156000,
    status: 'delivered',
    date: '2024-11-11',
  },
  {
    id: 'ORD-2024-004',
    customerName: 'Michael Tremblay',
    customerEmail: 'm.tremblay@email.ca',
    country: 'canada',
    items: [{ ...canadaProducts.find(p => p.id === 'ca-003')!, quantity: 3 }],
    total: 2295,
    status: 'delivered',
    date: '2024-11-13',
  },
  {
    id: 'ORD-2024-005',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@email.ca',
    country: 'canada',
    items: [
      { ...canadaProducts.find(p => p.id === 'ca-005')!, quantity: 1 },
      { ...canadaProducts.find(p => p.id === 'ca-010')!, quantity: 2 },
    ],
    total: 1477,
    status: 'shipped',
    date: '2024-11-15',
  },
  {
    id: 'ORD-2024-006',
    customerName: 'David Osei',
    customerEmail: 'd.osei@email.ca',
    country: 'canada',
    items: [{ ...canadaProducts.find(p => p.id === 'ca-001')!, quantity: 4 }],
    total: 756,
    status: 'pending',
    date: '2024-11-18',
  },
  {
    id: 'ORD-2024-009',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@email.ca',
    country: 'canada',
    items: [
      { ...canadaProducts.find(p => p.id === 'ca-015')!, quantity: 1 },
      { ...canadaProducts.find(p => p.id === 'ca-017')!, quantity: 2 },
    ],
    total: 807,
    status: 'processing',
    date: '2024-11-17',
  },
  {
    id: 'ORD-2024-010',
    customerName: 'Luc Beauchamp',
    customerEmail: 'luc.b@email.ca',
    country: 'canada',
    items: [
      { ...canadaProducts.find(p => p.id === 'ca-008')!, quantity: 1 },
      { ...canadaProducts.find(p => p.id === 'ca-022')!, quantity: 3 },
    ],
    total: 666,
    status: 'delivered',
    date: '2024-11-10',
  },
];

export const allProducts = [...nigeriaProducts, ...canadaProducts];

export const nigeriaCategories = [
  'All',
  'Oil & Gas Supplies',
  'Construction Materials',
  'General Commerce',
  'E-Commerce Goods',
];

export const canadaCategories = [
  'All',
  'Mining Equipment',
  'Construction Materials',
  'Industrial Supplies',
  'General Commerce',
];

export const formatPrice = (price: number, currency: 'NGN' | 'CAD') => {
  if (currency === 'NGN') {
    return `₦${price.toLocaleString()}`;
  }
  return `CA$${price.toLocaleString()}`;
};
