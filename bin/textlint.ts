import { cli } from "textlint";

import _1 from "textlint-filter-rule-comments";
import _2 from "textlint-rule-preset-ja-spacing";
import _3 from "textlint-rule-preset-ja-technical-writing";
import _4 from "textlint-filter-rule-allowlist";

let code = await cli.execute(Deno.args.join(" "));

if (code !== 0 && Deno.args.includes("--fix")) {
  code = await cli.execute(
    Deno.args.filter((arg) => arg !== "--fix").join(" "),
  );
}

Deno.exit(code);
