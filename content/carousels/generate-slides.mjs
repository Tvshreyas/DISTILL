import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "slides");
const templatePath = path.join(__dirname, "template.html");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const DAYS = 11;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Viewport exactly 1080px wide to match slide width
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });

  // Load template
  await page.goto(`file:///${templatePath.replace(/\\/g, "/")}`, {
    waitUntil: "networkidle0",
  });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Override layout: hide everything except slides, stack vertically
  await page.addStyleTag({
    content: `
      .controls, .instructions, .day-label, p { display: none !important; }
      h1 { display: none !important; }
      body { padding: 0 !important; margin: 0 !important; background: transparent !important; overflow: hidden !important; }
      .carousel-row {
        display: block !important;
        overflow: hidden !important;
        padding: 0 !important;
      }
      .slide {
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        display: none !important;
      }
      .slide.active-screenshot {
        display: flex !important;
      }
    `,
  });

  for (let day = 1; day <= DAYS; day++) {
    // Show this day
    await page.evaluate((d) => showDay(d), day);
    await new Promise((r) => setTimeout(r, 200));

    // Count slides for this day
    const slideCount = await page.$$eval(`#day-${day} .slide`, (els) => els.length);

    for (let i = 0; i < slideCount; i++) {
      const slideNum = i + 1;
      const filename = `day-${String(day).padStart(2, "0")}-slide-${String(slideNum).padStart(2, "0")}.png`;
      const filepath = path.join(outputDir, filename);

      // Show only this one slide
      await page.evaluate(
        (dayNum, idx) => {
          const slides = document.querySelectorAll(`#day-${dayNum} .slide`);
          slides.forEach((s, j) => {
            s.classList.toggle("active-screenshot", j === idx);
          });
        },
        day,
        i
      );

      await new Promise((r) => setTimeout(r, 100));

      // Screenshot the full viewport (which is exactly 1080x1350)
      await page.screenshot({
        path: filepath,
        type: "png",
        clip: { x: 0, y: 0, width: 1080, height: 1350 },
      });

      console.log(`Saved: ${filename}`);
    }
  }

  await browser.close();
  console.log(`\nDone! ${DAYS} days of slides saved to: ${outputDir}`);
})();
