/**
 * Asset Generator for TYTGEAR Market Research Survey
 * Generates modern, clean vector SVG placeholders for products, designs, and brand concepts.
 */

const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const publicDir = path.join(process.cwd(), "public");
const brandDir = path.join(publicDir, "images", "brand");
const designsDir = path.join(publicDir, "images", "designs");
const productsDir = path.join(publicDir, "images", "products");

ensureDir(brandDir);
ensureDir(designsDir);
ensureDir(productsDir);

// 1. TYTGEAR Logo
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <rect width="320" height="80" rx="12" fill="#4F766F" />
  <path d="M28 24 L52 24 L52 32 L44 32 L44 56 L36 56 L36 32 L28 32 Z" fill="#F2F0EA" />
  <path d="M58 24 L68 40 L78 24 L88 24 L74 46 L74 56 L66 56 L66 46 L52 24 Z" fill="#F2F0EA" />
  <path d="M92 24 L116 24 L116 32 L108 32 L108 56 L100 56 L100 32 L92 32 Z" fill="#F2F0EA" />
  <text x="132" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="32" fill="#F2F0EA" letter-spacing="4">GEAR</text>
  <circle cx="288" cy="40" r="6" fill="#A3C3BC" />
</svg>`;
fs.writeFileSync(path.join(brandDir, "logo.svg"), logoSvg);

// 2. TYTGEAR Concept Showcase Graphic
const conceptSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" rx="16" fill="#243431" />
  <circle cx="400" cy="225" r="180" fill="#2B3E3A" opacity="0.6" />
  <circle cx="400" cy="225" r="130" fill="#344D48" opacity="0.4" />
  
  <!-- Desk mat illustration -->
  <rect x="180" y="160" width="440" height="200" rx="12" fill="#4F766F" stroke="#75A49B" stroke-width="2" />
  <!-- Minimalist wave artwork on the mat -->
  <path d="M 200 300 Q 280 200 400 280 T 600 240" fill="none" stroke="#F2F0EA" stroke-width="4" opacity="0.85" />
  <path d="M 220 320 Q 320 220 440 300 T 580 260" fill="none" stroke="#C7DAD5" stroke-width="2" opacity="0.5" />
  
  <!-- Keyboard & Mouse silhouettes -->
  <rect x="240" y="190" width="180" height="80" rx="6" fill="#1C2826" opacity="0.9" stroke="#3D5C56" stroke-width="1.5" />
  <rect x="460" y="200" width="55" height="75" rx="20" fill="#1C2826" opacity="0.9" stroke="#3D5C56" stroke-width="1.5" />
  
  <text x="400" y="80" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="28" fill="#F2F0EA" letter-spacing="2">TYTGEAR CONCEPT</text>
  <text x="400" y="115" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="16" fill="#A3C3BC">Distinctive Gaming &amp; Lifestyle Aesthetics</text>
  <text x="400" y="405" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="14" fill="#C7DAD5" opacity="0.8">SETUP VISUAL IDENTITY • PREMIUM CRAFTSMANSHIP</text>
</svg>`;
fs.writeFileSync(path.join(brandDir, "tytgear-preview.svg"), conceptSvg);

// 3. Designs A through H
const designPalettes = [
  { name: "Design A", bg: "#2A3F3B", accent: "#75A49B", pattern: "waves" },
  { name: "Design B", bg: "#1F2E2B", accent: "#D4A373", pattern: "geometric" },
  { name: "Design C", bg: "#2E3842", accent: "#E07A5F", pattern: "cyber" },
  { name: "Design D", bg: "#2C2C34", accent: "#81B29A", pattern: "minimal-kanji" },
  { name: "Design E", bg: "#3D405B", accent: "#F4F1DE", pattern: "astronomy" },
  { name: "Design F", bg: "#1D3557", accent: "#457B9D", pattern: "topography" },
  { name: "Design G", bg: "#283618", accent: "#DDA15E", pattern: "nature" },
  { name: "Design H", bg: "#353535", accent: "#C7DAD5", pattern: "monochrome" },
];

designPalettes.forEach((d, idx) => {
  const code = String.fromCharCode(65 + idx).toLowerCase();
  let artwork = "";
  if (d.pattern === "waves") {
    artwork = `<path d="M 40 280 Q 160 80 280 280 T 520 280" fill="none" stroke="${d.accent}" stroke-width="6" />
               <path d="M 60 310 Q 180 110 300 310 T 540 310" fill="none" stroke="#F2F0EA" stroke-width="3" opacity="0.6"/>`;
  } else if (d.pattern === "geometric") {
    artwork = `<polygon points="300,100 450,320 150,320" fill="none" stroke="${d.accent}" stroke-width="4" />
               <circle cx="300" cy="220" r="70" fill="none" stroke="#F2F0EA" stroke-width="3" opacity="0.7"/>`;
  } else if (d.pattern === "cyber") {
    artwork = `<line x1="80" y1="120" x2="520" y2="120" stroke="${d.accent}" stroke-width="3" />
               <line x1="80" y1="200" x2="520" y2="200" stroke="${d.accent}" stroke-width="2" stroke-dasharray="12,8" />
               <line x1="80" y1="280" x2="520" y2="280" stroke="${d.accent}" stroke-width="3" />
               <circle cx="300" cy="200" r="60" fill="${d.accent}" opacity="0.3" />`;
  } else if (d.pattern === "minimal-kanji") {
    artwork = `<rect x="180" y="120" width="240" height="160" rx="8" fill="none" stroke="${d.accent}" stroke-width="3" />
               <circle cx="300" cy="200" r="45" fill="${d.accent}" opacity="0.85" />`;
  } else if (d.pattern === "astronomy") {
    artwork = `<circle cx="300" cy="200" r="90" fill="none" stroke="${d.accent}" stroke-width="3" />
               <ellipse cx="300" cy="200" rx="140" ry="40" fill="none" stroke="#F2F0EA" stroke-width="2" stroke-dasharray="6,4" />
               <circle cx="370" cy="180" r="16" fill="${d.accent}" />`;
  } else if (d.pattern === "topography") {
    artwork = `<path d="M 60 150 Q 200 90 320 180 T 540 140" fill="none" stroke="${d.accent}" stroke-width="3" />
               <path d="M 60 210 Q 220 150 340 240 T 540 200" fill="none" stroke="${d.accent}" stroke-width="3" />
               <path d="M 60 270 Q 240 210 360 300 T 540 260" fill="none" stroke="${d.accent}" stroke-width="3" />`;
  } else if (d.pattern === "nature") {
    artwork = `<path d="M 300 120 C 230 180 230 260 300 300 C 370 260 370 180 300 120 Z" fill="none" stroke="${d.accent}" stroke-width="4" />
               <line x1="300" y1="120" x2="300" y2="300" stroke="${d.accent}" stroke-width="2" />`;
  } else {
    artwork = `<circle cx="300" cy="200" r="80" fill="none" stroke="${d.accent}" stroke-width="6" />
               <line x1="220" y1="120" x2="380" y2="280" stroke="${d.accent}" stroke-width="4" />`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <rect width="600" height="400" rx="12" fill="${d.bg}" />
    ${artwork}
    <rect x="20" y="20" width="560" height="360" rx="8" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.1" />
    <rect x="30" y="330" width="130" height="38" rx="6" fill="#1C2826" opacity="0.8" />
    <text x="95" y="354" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#F2F0EA">${d.name}</text>
  </svg>`;

  fs.writeFileSync(path.join(designsDir, `design-${code}.svg`), svg);
});

// 4. Products SVG placeholders
const products = [
  { file: "small-mousepad.svg", title: "Small Mousepad", icon: "M 80 60 L 240 60 L 240 180 L 80 180 Z" },
  { file: "large-mousepad.svg", title: "Large Mousepad", icon: "M 60 50 L 260 50 L 260 190 L 60 190 Z" },
  { file: "desk-mat.svg", title: "Desk Mat", icon: "M 40 70 L 280 70 L 280 170 L 40 170 Z" },
  { file: "desk-accessories.svg", title: "Desk Accessories", icon: "M 130 50 L 190 50 L 190 190 L 130 190 Z" },
  { file: "tapestry.svg", title: "Wall Tapestry", icon: "M 70 40 L 250 40 L 230 200 L 90 200 Z" },
  { file: "wall-art.svg", title: "Posters / Wall Art", icon: "M 90 40 L 230 40 L 230 200 L 90 200 Z" },
  { file: "mobile-cover.svg", title: "Mobile Covers", icon: "M 110 40 L 210 40 L 210 200 L 110 200 Z" },
  { file: "apparel.svg", title: "Apparel", icon: "M 100 60 L 140 40 L 180 40 L 220 60 L 200 200 L 120 200 Z" },
  { file: "bags.svg", title: "Bags", icon: "M 90 70 L 230 70 L 220 200 L 100 200 Z" },
  { file: "other-accessories.svg", title: "Accessories", icon: "M 160 60 A 60 60 0 1 0 160 180 A 60 60 0 1 0 160 60 Z" },
];

products.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240">
    <rect width="320" height="240" rx="10" fill="#EAE7DF" />
    <path d="${p.icon}" fill="#4F766F" opacity="0.85" rx="4" />
    <text x="160" y="222" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#2B3E3A">${p.title}</text>
  </svg>`;
  fs.writeFileSync(path.join(productsDir, p.file), svg);
});

console.log("All vector placeholder assets created successfully!");
