import { Command } from 'commander';
import {version} from '../package.json';

const program = new Command();

program
  .name('convollm')
  .description('Convert chat conversations to LLM-friendly JSON format')
  .version(version);

program
  .command('convert')
  .description('Convert chat logs to JSON')
  .requiredOption('-i, --input <path>', 'Input file or directory')
  .option('-o, --output <path>', 'Output file path')
  .option('-p, --platform <platform>', 'Chat platform (discord, telegram, etc)')
  .action((options) => {
    console.log('Converting chat:', options.input);
    // Call your existing parsing methods here
    // if (options.platform === 'discord') parseDiscord(options.input, options.output);
    // ...
  });

program.parse();