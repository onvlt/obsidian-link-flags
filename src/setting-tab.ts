import { App, PluginSettingTab, Setting } from "obsidian";
import FlagsPlugin from "./main";
import * as Rule from "./rule";

export class FlagsSettingTab extends PluginSettingTab {
  plugin: FlagsPlugin;

  constructor(app: App, plugin: FlagsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Flags" });
    containerEl.createEl("p", {
      text:
        "Flags are pieces of metadata displayed next to links, extracted from the linked page's metadata.",
    });

    new Setting(containerEl)
      .setName("Flags before link (comma-separated list)")
      .setDesc(
        "Comma-separated list of front-matter fields that should be displayed before the link."
      )
      .addText((text) =>
        text
          .setPlaceholder("completed,status")
          .setValue(Rule.encodeArray(this.plugin.settings.flagsBeforeLink))
          .onChange((value) => {
            this.plugin.settings.flagsBeforeLink = Rule.decodeArray(value);
            this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Flags after link (comma-separated list)")
      .setDesc(
        "Comma-separated list of front-matter fields that should be displayed after the link."
      )
      .addText((text) =>
        text
          .setPlaceholder("created,status")
          .setValue(Rule.encodeArray(this.plugin.settings.flagsAfterLink))
          .onChange((value) => {
            this.plugin.settings.flagsAfterLink = Rule.decodeArray(value);
            this.plugin.saveSettings();
          })
      );
  }
}
