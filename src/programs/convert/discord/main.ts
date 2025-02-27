import path from "node:path";

interface IOptions {
    input: string;
    output?: string;
}

export function convertDiscord(options: IOptions) {
    const input = path.resolve(options.input);
    const output = options.output ? path.resolve(options.output) : path.dirname(input);
    console.log({input, output});
}