# Atom One Light Theme for Zed

Atom One Light Theme is a Zed port of the VS Code theme by [akamud](https://github.com/akamud/vscode-theme-onelight), based on Atom's One Light colors.


## Install Locally

1. Open Zed.
2. Run `zed: install dev extension` from the command palette.
3. Select this repository directory.
4. Pick `Atom One Light` from the theme selector.

You can also select it from `settings.json`:

```json
{
  "theme": {
    "mode": "light",
    "light": "Atom One Light",
    "dark": "One Dark"
  }
}
```

## Project Layout

- `extension.toml` is the Zed extension manifest.
- `themes/atom-one-light.json` is the generated Zed theme family.
- `source/vscode/OneLight.json` is the original VS Code theme source used by `scripts/build-theme.mjs`.
- `screenshots/preview.png` is kept for the extension README and repository page.

## Rebuild Theme

```sh
node scripts/build-theme.mjs
```

## Publish

1. Push this repository to GitHub and update `repository` in `extension.toml` if needed.
2. Fork `zed-industries/extensions`.
3. Add this repository as a submodule under `extensions/atom-one-light-theme`.
4. Add an `extensions.toml` entry:

```toml
[atom-one-light-theme]
submodule = "extensions/atom-one-light-theme"
version = "0.1.0"
```

5. Run `pnpm sort-extensions` in the `zed-industries/extensions` repo and open a PR.

## Credits

- Original VS Code theme: [akamud/vscode-theme-onelight](https://github.com/akamud/vscode-theme-onelight)
- Original Atom One Light colors: [atom/one-light-syntax](https://github.com/atom/one-light-syntax)
