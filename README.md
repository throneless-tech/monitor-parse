# pdf2feed

This script makes a best effort attempt to extract URLs from a PDF file and then
scrape those URLs for Open Graph data, constructing a JSON feed of the resulting
data.

## Usage

- Clone this repository
- Run `npm install`
- Run `npm run parse -- -i <input PDF file> -o <output JSON file>` (If the -o
  option is ommitted, output is printed to stdout)
