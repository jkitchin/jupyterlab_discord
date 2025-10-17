"""IPython magics for jupyterlab_discord"""
from IPython.core.magic import Magics, magics_class, line_magic
from IPython.display import IFrame, HTML
import argparse
import shlex


@magics_class
class DiscordMagics(Magics):
    """Magics for embedding Discord widgets in Jupyter notebooks"""

    @line_magic
    def discord(self, line):
        """
        Display a Discord widget using widgetbot.io

        Usage:
            %discord [-w WIDTH] [-ht HEIGHT]

        Arguments:
            -w, --width: Width of the iframe (default: 1200)
            -ht, --height: Height of the iframe (default: 600)

        Example:
            %discord
            %discord -w 800 -ht 400
        """
        parser = argparse.ArgumentParser(description='Display Discord widget', add_help=False)
        parser.add_argument('-w', '--width', type=int, default=1200,
                          help='Width of the Discord widget (default: 1200)')
        parser.add_argument('-ht', '--height', type=int, default=600,
                          help='Height of the Discord widget (default: 600)')

        try:
            args = parser.parse_args(shlex.split(line))
        except SystemExit:
            return None

        url = "https://e.widgetbot.io/channels/1408876219008553041/1408876219008553044"
        return IFrame(url, args.width, args.height)

    @line_magic
    def pyter(self, line):
        """
        Display a Discord Crate widget (floating button)

        Usage:
            %pyter

        Example:
            %pyter
        """
        html_code = """<script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async defer>
    new Crate({
    server: '1408876219008553041',
    channel: '1425580151521153064'
    })
    </script>"""
        return HTML(html_code)


def load_ipython_extension(ipython):
    """Load the extension in IPython."""
    ipython.register_magics(DiscordMagics)
