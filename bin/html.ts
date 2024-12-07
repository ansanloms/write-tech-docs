import * as path from "@std/path";
import * as fs from "@std/fs";
import { Command } from "@cliffy/command";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const { options } = await new Command()
  .option(
    "-i, --input <input:string>",
    "input markdown file.",
    { required: true },
  )
  .option(
    "-o, --output <output:string>",
    "output html file.",
    { required: true },
  )
  .parse(Deno.args);

const getFilepath = async (filepath: string, exists: boolean) => {
  const relative = path.resolve(filepath);
  return (!exists || await fs.exists(relative))
    ? relative
    : path.resolve(path.join(Deno.cwd(), relative));
};

const [input, output] = await Promise.all([
  getFilepath(options.input, true),
  getFilepath(options.output, false),
]);

const markdown = await Deno.readTextFile(input);

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(markdown);

const html = `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    ${file.toString()}
  </body>
</html>`.trim();

await Deno.writeTextFile(output, html);
