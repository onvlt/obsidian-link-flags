import { Rule } from "./rule";
import * as D from "io-ts/Decoder";

export interface Settings {
  flagsBeforeLink: Array<Rule>;
  flagsAfterLink: Array<Rule>;
}

export const Settings: D.Decoder<unknown, Partial<Settings>> = D.partial({
  flagsBeforeLink: D.array(Rule),
  flagsAfterLink: D.array(Rule),
});

export const defaultSettings: Settings = {
  flagsBeforeLink: [],
  flagsAfterLink: [],
};

export function normalize(settings: Partial<Settings>): Settings {
  return { ...defaultSettings, ...settings };
}
