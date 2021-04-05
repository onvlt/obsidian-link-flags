import {
  MarkdownPostProcessorContext,
  MarkdownPreviewRenderer,
  Plugin,
} from "obsidian";
import { renderFlags } from "./flag";
import * as Settings from "./settings";
import { FlagsSettingTab } from "./setting-tab";
import * as D from "io-ts/Decoder";
import * as E from "fp-ts/Either";

export default class FlagsPlugin extends Plugin {
  settings: Settings.Settings = Settings.defaultSettings;

  async onload() {
    console.log(`[${this.manifest.id}] Plugin loaded`);
    await this.loadSettings();
    this.addSettingTab(new FlagsSettingTab(this.app, this));
    MarkdownPreviewRenderer.registerPostProcessor(this.markdownPostProcessor);
  }

  async onunload() {
    console.log(`[${this.manifest.id}] Plugin unloaded`);
    MarkdownPreviewRenderer.unregisterPostProcessor(this.markdownPostProcessor);
  }

  markdownPostProcessor = (
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ): void => {
    const files = this.app.vault.getMarkdownFiles();

    el.querySelectorAll("a.internal-link").forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const path = link.getAttr("href");
      const file = files.find((f) => f.basename === path);

      if (!file) {
        return;
      }

      const metadata = this.app.metadataCache.getFileCache(file);
      const frontmatter = metadata?.frontmatter;

      if (!frontmatter) {
        return;
      }

      renderFlags(link, frontmatter, this.settings);
    });
  };

  async loadSettings() {
    const storedData: unknown = (await this.loadData()) ?? {};
    const settingsResult = Settings.Settings.decode(storedData);

    if (E.isLeft(settingsResult)) {
      console.error(
        `[${this.manifest.id}] Failed to decode settings; using default settings instead\n`,
        D.draw(settingsResult.left)
      );
      return;
    }

    this.settings = Settings.normalize(settingsResult.right);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
