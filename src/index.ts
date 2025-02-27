import { Command } from 'commander';
import {version} from '../package.json';
import { convertDiscord } from './convert/discord/main';

const program = new Command();

program
  .name('convollm')
  .description('Convert chat conversations to LLM-friendly JSON format')
  .version(version);

const convert = program
  .command('convert')
  .description('Convert chat logs from many chat sources to JSON')
  
convert
  .command('discord')
  .requiredOption('-i, --input <path>', 'Input file or directory')
  .option('-o, --output <path>', 'Output file path')
  .action(convertDiscord);

program.parse();