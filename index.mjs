import fs from "fs/promises";
import { Command } from "commander";
import { PDFExtract } from "pdf.js-extract";
import ogs from "open-graph-scraper";

const program = new Command();
program
  .requiredOption("-i, --in <path>", "Input file")
  .requiredOption("-o, --out <path>", "Output file");
program.parse(process.argv);
const options = program.opts();

async function main() {
  const pdfExtract = new PDFExtract();
  try {
    const contents = await pdfExtract.extract(options.in, {});
    const links = contents.pages.reduce((allLinks, page) => {
      if (Array.isArray(page.links) && page.links.length) {
        return allLinks.concat(page.links);
      }
      return allLinks;
    }, []);
    const sorted = [...new Set(links)].sort();

    console.log("Parsed PDF, scraping the URLs with open-graph-scraper")
    const results = sorted.map(async link => {
      try {
        const { error, result, response } = await ogs({
          url: link,
          headers: {
            "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
          }, // per https://github.com/jshemas/openGraphScraper/pull/114, in order to pull Twitter description
        });
        if (error) throw error 
        return {
            title: result.ogTitle,
            description: result.ogDescription,
            url: result.ogUrl
        };
      } catch (err) {
        console.error("Error:", err);
      }
    });
    console.log("Done!")
    await fs.writeFile(options.out, JSON.stringify(await Promise.all(results), null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
