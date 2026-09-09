const fs = require("fs");
const path = require("path");

const sourceBase = "C:\\Users\\apexp\\OneDrive\\Desktop\\Cracked Games and Software and Projects\\Projects\\TYTGEAR.in";
const destBase = path.join(process.cwd(), "public", "images");

const assetMappings = [
  // Logos
  {
    src: path.join(sourceBase, "Logos", "Untitled design (1).png"),
    dest: path.join(destBase, "brand", "tytgear-logo.png"),
  },
  {
    src: path.join(sourceBase, "Logos", "Untitled design.png"),
    dest: path.join(destBase, "brand", "tytgear-icon.png"),
  },
  // Brand Showcase for Section H (desk mat + keyboard setup)
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "topo-black4.webp"),
    dest: path.join(destBase, "brand", "tytgear-showcase.webp"),
  },
  // Small Mousepad for Section G (Price Sensitivity)
  {
    src: path.join(sourceBase, "Mousepad Mockups", "smp", "topo black 1.webp"),
    dest: path.join(destBase, "products", "small-mousepad.webp"),
  },
  // Designs A through H for Section F (Neutral Blind Evaluation)
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "topo-black.webp"),
    dest: path.join(destBase, "designs", "design-a.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "topo-white.webp"),
    dest: path.join(destBase, "designs", "design-b.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "samurai.webp"),
    dest: path.join(destBase, "designs", "design-c.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "japcastle.webp"),
    dest: path.join(destBase, "designs", "design-d.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "f1car.webp"),
    dest: path.join(destBase, "designs", "design-e.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "sukhoi.webp"),
    dest: path.join(destBase, "designs", "design-f.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "ghost.webp"),
    dest: path.join(destBase, "designs", "design-g.webp"),
  },
  {
    src: path.join(sourceBase, "Mousepad Mockups", ".webp", "luffy.webp"),
    dest: path.join(destBase, "designs", "design-h.webp"),
  },
];

console.log("Copying real TYTGEAR brand identity assets...");

for (const mapping of assetMappings) {
  const destDir = path.dirname(mapping.dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(mapping.src)) {
    fs.copyFileSync(mapping.src, mapping.dest);
    const stat = fs.statSync(mapping.dest);
    console.log(`✔ Copied: ${path.basename(mapping.dest)} (${Math.round(stat.size / 1024)} KB)`);
  } else {
    console.error(`✖ Source not found: ${mapping.src}`);
  }
}

console.log("Brand assets copied successfully!");
