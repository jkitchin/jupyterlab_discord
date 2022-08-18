import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { Widget } from '@lumino/widgets';

/**
 * Initialization data for the jupyterlab_discord extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_discord:plugin',
  autoStart: true,
  optional: [ICommandPalette, ISettingRegistry],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    settingRegistry: ISettingRegistry
  ) => {
    console.log('JupyterLab extension jupyterlab_discord activation starting!');

    let discord_server = '0';
    let discord_channel = '0';
    let discord_height = '0';
    let discord_width = '0';

    if (settingRegistry) {
      const setting = await settingRegistry.load(plugin.id);
      discord_server = setting.get('discord_server').composite as string;
      discord_channel = setting.get('discord_channel').composite as string;
      discord_width = setting.get('discord_width').composite as string;
      discord_height = setting.get('discord_height').composite as string;

      console.log('jupyterlab_discord settings loaded:', setting.composite);
    }

    // Create a blank content widget inside of a MainAreaWidget
    const content = new Widget();
    const widget = new MainAreaWidget({ content });

    widget.id = 'discord-jupyterlab';
    widget.title.label = 'Discord';
    widget.title.closable = true;

    const html = document.createElement('div');

    const discord_url =
      '<iframe src="https://e.widgetbot.io/channels/' +
      `${discord_server}/${discord_channel}` +
      `"height="${discord_height}" width="${discord_width}"></iframe>`;

    // Note some tags are stripped out, e.g. <script>
    // So it is not possible to embed gitter in (https://sidecar.gitter.im/)
    // or to use some of the other preferred methods for Discord.

    // https://docs.widgetbot.io/tutorial/iframes/#getting-started
    html.innerHTML = discord_url;

    console.log(`    Discord server:  ${discord_server}`);
    console.log(`    Discord channel: ${discord_channel}`);
    console.log(`    Discord url: ${discord_url}`);
    content.node.appendChild(html);

    // Add an application command
    const command = 'discord:open';
    app.commands.addCommand(command, {
      label: 'Open Discord',
      execute: () => {
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Discord' });

    console.log('JupyterLab extension jupyterlab_discord activation finished!');
  } // end activate
};

export default plugin;
