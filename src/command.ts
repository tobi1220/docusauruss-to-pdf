import { Command, Option } from 'commander';
import {
  commaSeparatedList,
  generatePuppeteerPDFMargin,
} from './commander-options.js';
import { generatePDF, GeneratePDFOptions } from './core.js';
import {
  generateDocusaurusPDF,
  DocusaurusOptions,
} from './provider/docusaurus.js';
import chalk from 'chalk';
import consoleStamp from 'console-stamp';
const version = await import("../package.json", { assert: { type: "json" } }).then(module => module.default.version);

consoleStamp.default(console);

export function makeProgram() {
  const program = new Command('');
  const docstopdf = program
    .command('docs-to-pdf')
    .version(version, '-v, --vers', 'output the current version')
    .showSuggestionAfterError()
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    });

  docstopdf
    .command('docusaurus')
    .alias('d')
    .description('generate PDF from Docusaurus site')
    .option(
      '--version <version>',
      'version of Docusaurus site to generate PDF from',
      '2',
    )
    .addOption(
      new Option(
        '--docsDir <dir>',
        'directory of docs in Docusaurus site to generate PDF from',
      ),
    )
    .action((options: DocusaurusOptions) => {
      console.debug('Generate from Docusaurus');
      console.debug(options);
      generateDocusaurusPDF(options)
        .then(() => {
          console.log(chalk.green('Finish generating PDF!'));
          process.exit(0);
        })
        .catch((err: { stack: unknown }) => {
          console.error(chalk.red(err.stack));
          process.exit(1);
        });
    });

  docstopdf.commands.forEach((cmd) => {
    cmd
      .option(
        '--docsEntryPoint <urls>',
        'set urls to start generating PDF from',
        commaSeparatedList,
      )
      .option(
        '--excludeURLs <urls>',
        'urls to be excluded in PDF',
        commaSeparatedList,
      )
      .option(
        '--contentSelector <selector>',
        'used to find the part of main content',
      )
      .option('--paginationSelector <selector>', 'used to find next url')
      .option(
        '--excludeSelectors <selectors>',
        'exclude selector ex: .nav',
        commaSeparatedList,
      )
      .option(
        '--cssStyle <cssString>',
        'css style to adjust PDF output ex: body{padding-top: 0;}',
      )
      .option('--outputPDFFilename <filename>', 'name of output PDF file')
      .option(
        '--pdfMargin <margin>',
        'set margin around PDF file',
        generatePuppeteerPDFMargin,
      )
      .option('--paperFormat <format>', 'pdf format ex: A3, A4...')
      .option('--coverTitle <title>', 'title for PDF cover')
      .option(
        '--coverImage <src>',
        'image for PDF cover. *.svg file not working!',
      )
      .option('--disableTOC', 'disable table of contents')
      .option('--coverSub <subtitle>', 'subtitle for PDF cover')
      .option(
        '--waitForRender <timeout>',
        'wait for document render in milliseconds',
      )
      .option('--headerTemplate <html>', 'html template for page header')
      .option('--footerTemplate <html>', 'html template for page footer')
      .option(
        '--puppeteerArgs <selectors>',
        'add puppeteer arguments ex: --sandbox',
        commaSeparatedList,
      )
      .option(
        '--protocolTimeout <timeout>',
        'timeout setting for individual protocol calls in milliseconds',
        commaSeparatedList,
      )
      .option('--filterKeyword <filterKeyword>', 'meta keyword to filter pages')
      .option(
        '--baseUrl <baseUrl>',
        'base URL for all relative URLs. Allows to render the pdf on localhost while referencing the deployed page.',
      )
      .option(
        '--excludePaths <paths>',
        'paths to be excluded in PDF',
        commaSeparatedList,
      )
      .option(
        '--restrictPaths',
        'only the paths in the --docsEntryPoint will be included in the PDF',
      )
      .option(
        '--openDetail',
        'open details elements in the PDF, default is open',
      );
  });

  return program;
}
