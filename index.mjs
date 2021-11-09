import fs from 'fs/promises';
import { Command } from 'commander';
//import PDFParser from 'pdf2json';
import { PDFExtract } from 'pdf.js-extract';

const program = new Command();
program.requiredOption('-i, --in <path>', 'Input file').requiredOption('-o, --out <path>', 'Output file');
program.parse(process.argv);
const options = program.opts();

//const pdfParser = new PDFParser(this, 1);
//pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
//pdfParser.on("pdfParser_dataReady", async () => {
//    await fs.writeFile(options.out, pdfParser.getRawTextContent());
//});
//
//pdfParser.loadPDF(options.in);

async function main() {
    const pdfExtract = new PDFExtract();
    try {
        const contents = await pdfExtract.extract(options.in, {});
        console.log(contents.pages);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
