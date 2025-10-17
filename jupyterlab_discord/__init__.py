import json
from pathlib import Path

from ._version import __version__


HERE = Path(__file__).parent.resolve()

# Try to load labextension data, but don't fail if it's not built yet
try:
    with (HERE / "labextension" / "package.json").open() as fid:
        data = json.load(fid)
except FileNotFoundError:
    data = {"name": "jupyterlab_discord"}


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": data["name"]
    }]


def load_ipython_extension(ipython):
    """Load the IPython extension."""
    from .magics import load_ipython_extension as load_magics
    load_magics(ipython)


# Auto-load the IPython extension when the module is imported in an IPython environment
try:
    get_ipython()
    load_ipython_extension(get_ipython())
except NameError:
    # Not in an IPython environment
    pass

