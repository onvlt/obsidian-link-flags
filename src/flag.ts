import { Rule } from "./rule";
import { Settings } from "./settings";

interface Flag {
  rule: Rule;
  value: unknown;
}

/**
 * Extract flags of given keys from frontmatter.
 */
function processFlags(
  frontMatter: Record<string, unknown>,
  rules: Array<Rule>
): Array<Flag> {
  return rules
    .map((rule) => ({ rule, value: frontMatter[rule.key] }))
    .filter((flag) => typeof flag.value !== "undefined");
}

/**
 * Prepend or appends flag element to the link element.
 */
function renderFlag(
  linkEl: HTMLElement,
  flag: Flag,
  position: "before" | "after"
) {
  const display = displayFlagValue(flag);

  if (display === null) {
    return;
  }

  const el = document.createElement("span");

  el.setAttribute(`data-flag-key`, flag.rule.key);
  el.setAttribute(`data-flag-value`, JSON.stringify(flag.value));

  el.classList.add("tag", "flag", `flag--${position}`);

  if (display.value) {
    el.innerText = flag.rule.hideKey
      ? display.value
      : `${flag.rule.key}: ${display.value}`;
  } else {
    el.innerText = flag.rule.key;
  }

  if (position === "before") {
    linkEl.prepend(el);
  } else {
    linkEl.append(el);
  }
}

/**
 * Convert flag's value of uknown type to human-readable string.
 * If it returns `null`, it means the flag should not be displayed at all.
 * If it returns `{ value: null }`, it should display only flag `key` without any value.
 */
function displayFlagValue(flag: Flag): null | { value: null | string } {
  if (
    flag.value === null ||
    flag.value === false ||
    typeof flag.value === "undefined"
  ) {
    return null;
  }

  if (flag.value === true) {
    return { value: null };
  }

  if (typeof flag.value === "string" || typeof flag.value === "number") {
    return { value: String(flag.value) };
  }

  if (Array.isArray(flag.value)) {
    return {
      value: flag.value.filter((s) => typeof s === "string").join(", "),
    };
  }

  return { value: null };
}

/**
 * Render flags around given link element.
 */
export function renderFlags(
  linkEl: HTMLElement,
  frontMatter: Record<string, unknown>,
  settings: Settings
): void {
  const flagsBefore = processFlags(frontMatter, settings.flagsBeforeLink);
  const flagsAfter = processFlags(frontMatter, settings.flagsAfterLink);

  flagsBefore.reverse().forEach((flag) => renderFlag(linkEl, flag, "before"));
  flagsAfter.forEach((flag) => renderFlag(linkEl, flag, "after"));
}
