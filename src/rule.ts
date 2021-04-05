import { pipe } from "fp-ts/function";
import * as D from "io-ts/Decoder";

export interface Rule {
  key: string;
  hideKey?: boolean;
}

export const Rule: D.Decoder<unknown, Rule> = pipe(
  D.struct({
    key: D.string,
  }),
  D.intersect(
    D.partial({
      hideKey: D.boolean,
    })
  )
);

export function encodeArray(rules: Array<Rule>): string {
  return rules
    .map((rule) => (rule.hideKey ? "-" : "") + rule.key.trim())
    .join(",");
}

export function decodeArray(rulesString: string): Array<Rule> {
  return rulesString
    .split(",")
    .map((s) => s.trim())
    .map((key) => {
      if (key[0] === "-") {
        return {
          key: key.slice(1),
          hideKey: true,
        };
      }

      return {
        key,
      };
    });
}
