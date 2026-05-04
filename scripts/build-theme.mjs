import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "source", "vscode", "OneLight.json");
const outputPath = path.join(root, "themes", "atom-one-light.json");

const vscodeTheme = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const colors = vscodeTheme.colors ?? {};
const tokenColors = vscodeTheme.tokenColors ?? [];

const palette = {
  primary: "#383A42",
  text: "#232324",
  muted: "#696C77",
  placeholder: "#9D9D9F",
  inlay: "#AFB2BB",
  editor: "#FAFAFA",
  panel: "#EAEAEB",
  surface: "#FFFFFF",
  border: "#DBDBDC",
  borderVariant: "#E5E5E6",
  accent: "#526FFF",
  blue: "#4078F2",
  cyan: "#0184BC",
  green: "#50A14F",
  red: "#E45649",
  crimson: "#CA1243",
  magenta: "#A626A4",
  gold: "#C18401",
  orange: "#986801",
  deprecated: "#F2A60D",
};

function toZedColor(color) {
  if (color == null) {
    return null;
  }

  if (typeof color !== "string") {
    return color;
  }

  if (color.toLowerCase() === "white") {
    return "#ffffffff";
  }

  if (color.toLowerCase() === "black") {
    return "#000000ff";
  }

  if (/^#[0-9a-f]{6}$/iu.test(color)) {
    return `${color}ff`;
  }

  return color;
}

function color(name, fallback) {
  return toZedColor(colors[name] ?? fallback);
}

function scopesFor(rule) {
  const scope = rule.scope ?? [];
  const scopes = Array.isArray(scope) ? scope : [scope];

  return scopes
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function token(scope, fallback) {
  const rule = tokenColors.find((candidate) => scopesFor(candidate).includes(scope));
  return toZedColor(rule?.settings?.foreground ?? fallback);
}

function fontStyle(scope) {
  const rule = tokenColors.find((candidate) => scopesFor(candidate).includes(scope));
  const value = rule?.settings?.fontStyle ?? "";

  if (value.includes("italic")) {
    return "italic";
  }

  if (value.includes("oblique")) {
    return "oblique";
  }

  return null;
}

function fontWeight(scope) {
  const rule = tokenColors.find((candidate) => scopesFor(candidate).includes(scope));
  const value = rule?.settings?.fontStyle ?? "";

  return value.includes("bold") ? 700 : null;
}

function highlight(foreground, options = {}) {
  return {
    color: toZedColor(foreground),
    font_style: options.fontStyle ?? null,
    font_weight: options.fontWeight ?? null,
    ...(options.background ? { background_color: toZedColor(options.background) } : {}),
  };
}

const syntax = {
  attribute: highlight(token("entity.other.attribute-name", palette.orange)),
  boolean: highlight(token("constant.language.json", palette.cyan)),
  comment: highlight(token("comment", palette.inlay), {
    fontStyle: fontStyle("comment") ?? "italic",
  }),
  "comment.doc": highlight(token("comment", palette.inlay), {
    fontStyle: fontStyle("comment") ?? "italic",
  }),
  "comment.documentation": highlight(token("comment", palette.inlay), {
    fontStyle: fontStyle("comment") ?? "italic",
  }),
  constant: highlight(token("constant", palette.orange)),
  "constant.builtin": highlight(token("constant.character.escape", palette.cyan)),
  constructor: highlight(token("entity.name.type", palette.gold)),
  embedded: highlight(token("string > source", palette.primary)),
  emphasis: highlight(token("markup.italic", palette.magenta), {
    fontStyle: fontStyle("markup.italic") ?? "italic",
  }),
  "emphasis.strong": highlight(token("markup.bold", palette.orange), {
    fontWeight: fontWeight("markup.bold") ?? 700,
  }),
  enum: highlight(token("entity.name.type", palette.gold)),
  "enum.member": highlight(token("constant.other.symbol", palette.cyan)),
  function: highlight(token("entity.name.function", palette.blue)),
  "function.builtin": highlight(token("support.function", palette.cyan)),
  "function.macro": highlight(token("keyword.other.special-method", palette.blue)),
  "function.method": highlight(token("support.function.any-method", palette.blue)),
  hint: highlight(color("editorInlayHint.foreground", palette.inlay)),
  keyword: highlight(token("keyword", palette.magenta)),
  label: highlight(token("entity.name.section", palette.blue)),
  link_text: highlight(token("markup.link", palette.cyan), { fontStyle: "italic" }),
  link_uri: highlight(token("string.other.link", palette.red)),
  namespace: highlight(token("storage.modifier.import", palette.primary)),
  number: highlight(token("constant.numeric", palette.orange)),
  operator: highlight(token("keyword.operator", palette.primary)),
  predictive: highlight(color("editorInlayHint.foreground", palette.inlay), {
    fontStyle: "italic",
  }),
  preproc: highlight(token("storage", palette.magenta)),
  primary: highlight(color("editor.foreground", palette.primary)),
  property: highlight(token("support.type.property-name.json", palette.red)),
  "property.definition": highlight(token("meta.definition.property.js variable", palette.primary)),
  punctuation: highlight(token("punctuation.section.method", palette.primary)),
  "punctuation.bracket": highlight(token("punctuation.section.method", palette.primary)),
  "punctuation.delimiter": highlight(token("punctuation.definition.separator", palette.primary)),
  "punctuation.list_marker": highlight(token("beginning.punctuation.definition.list.markdown", palette.red)),
  "punctuation.markup": highlight(token("punctuation.definition.heading.markdown", palette.red)),
  "punctuation.special": highlight(token("punctuation.section.embedded", palette.crimson)),
  selector: highlight(token("meta.selector", palette.magenta)),
  "selector.pseudo": highlight(token("entity.other.attribute-name.id", palette.blue)),
  string: highlight(token("string", palette.green)),
  "string.escape": highlight(token("constant.character.escape", palette.cyan)),
  "string.regex": highlight(token("string.regexp", palette.cyan)),
  "string.special": highlight(token("string.regexp source.ruby.embedded", palette.gold)),
  "string.special.symbol": highlight(token("constant.other.symbol", palette.cyan)),
  tag: highlight(token("entity.name.tag", palette.red)),
  "tag.doctype": highlight(token("meta.tag", palette.primary)),
  "text.literal": highlight(token("markup.raw", palette.green)),
  title: highlight(token("markup.heading", palette.red), { fontWeight: 400 }),
  type: highlight(token("entity.name.type", palette.gold)),
  "type.builtin": highlight(token("support.type", palette.cyan)),
  "type.class": highlight(token("entity.name.class", palette.gold)),
  "type.enum": highlight(token("entity.name.type", palette.gold)),
  "type.interface": highlight(token("entity.name.type", palette.gold)),
  "type.parameter": highlight(token("meta.type.parameters.ts support.type", palette.primary)),
  variable: highlight(color("editor.foreground", palette.primary)),
  "variable.member": highlight(token("support.variable.property.js", palette.red)),
  "variable.parameter": highlight(token("variable.parameter", palette.primary)),
  "variable.property": highlight(token("support.variable.property.js", palette.red)),
  "variable.special": highlight(token("variable.interpolation", palette.crimson)),
  variant: highlight(token("keyword.other.special-method", palette.blue)),
  "diff.plus": highlight(token("markup.inserted", palette.green)),
  "diff.minus": highlight(token("markup.deleted", palette.red)),
  invalid: highlight(token("invalid.illegal", "#ffffff"), {
    background: "#FF1414",
  }),
  "invalid.deprecated": highlight(token("invalid.deprecated", "#000000"), {
    background: palette.deprecated,
  }),
};

const style = {
  accents: [
    color("focusBorder", palette.accent),
    toZedColor(palette.blue),
    toZedColor(palette.cyan),
    toZedColor(palette.green),
    toZedColor(palette.gold),
    toZedColor(palette.orange),
    toZedColor(palette.red),
    toZedColor(palette.magenta),
  ],
  background: color("editorGroupHeader.tabsBackground", palette.panel),
  "background.appearance": "opaque",
  border: color("editorGroup.border", palette.border),
  "border.disabled": "#DBDBDC80",
  "border.focused": color("focusBorder", palette.accent),
  "border.selected": "#526FFF66",
  "border.transparent": "#00000000",
  "border.variant": color("editorWidget.border", palette.borderVariant),
  conflict: toZedColor(palette.orange),
  "conflict.background": "#9868011a",
  "conflict.border": "#98680140",
  created: color("extensionButton.prominentBackground", palette.green),
  "created.background": "#50A14F1a",
  "created.border": "#50A14F40",
  deleted: toZedColor(palette.red),
  "deleted.background": "#E456491a",
  "deleted.border": "#E4564940",
  "drop_target.background": color("editor.findMatchHighlightBackground", "#526FFF33"),
  "editor.active_line.background": color("editor.lineHighlightBackground", "#383A420C"),
  "editor.active_line_number": color("editorLineNumber.activeForeground", palette.primary),
  "editor.active_wrap_guide": color("editorIndentGuide.activeBackground", "#626772"),
  "editor.background": color("editor.background", palette.editor),
  "editor.document_highlight.bracket_background": "#383A421a",
  "editor.document_highlight.read_background": color("editor.findMatchHighlightBackground", "#526FFF33"),
  "editor.document_highlight.write_background": color("editorIndentGuide.background", "#383A4233"),
  "editor.foreground": color("editor.foreground", palette.primary),
  "editor.gutter.background": color("editor.background", palette.editor),
  "editor.highlighted_line.background": color("editor.lineHighlightBackground", "#383A420C"),
  "editor.hover_line_number": color("editorLineNumber.activeForeground", palette.primary),
  "editor.indent_guide": color("editorIndentGuide.background", "#383A4233"),
  "editor.indent_guide_active": color("editorIndentGuide.activeBackground", "#626772"),
  "editor.invisible": color("editorWhitespace.foreground", "#383A4233"),
  "editor.line_number": color("editorLineNumber.foreground", palette.placeholder),
  "editor.subheader.background": color("editorHoverWidget.background", palette.panel),
  "editor.wrap_guide": color("editorRuler.foreground", "#383A4233"),
  "element.active": color("list.activeSelectionBackground", palette.border),
  "element.background": color("input.background", palette.surface),
  "element.disabled": color("editorInlayHint.background", "#F5F5F5"),
  "element.hover": color("list.hoverBackground", "#DBDBDC66"),
  "element.selected": color("list.activeSelectionBackground", palette.border),
  "elevated_surface.background": color("dropdown.background", palette.surface),
  error: toZedColor(palette.red),
  "error.background": "#E456491a",
  "error.border": "#E4564940",
  "ghost_element.active": color("list.activeSelectionBackground", palette.border),
  "ghost_element.background": "#00000000",
  "ghost_element.disabled": color("editorInlayHint.background", "#F5F5F5"),
  "ghost_element.hover": color("list.hoverBackground", "#DBDBDC66"),
  "ghost_element.selected": color("list.activeSelectionBackground", palette.border),
  hidden: color("editorInlayHint.foreground", palette.inlay),
  "hidden.background": "#AFB2BB1a",
  "hidden.border": "#AFB2BB40",
  hint: color("editorInlayHint.foreground", palette.inlay),
  "hint.background": "#526FFF1a",
  "hint.border": "#526FFF40",
  icon: color("titleBar.activeForeground", "#424243"),
  "icon.accent": color("focusBorder", palette.accent),
  "icon.disabled": color("editorInlayHint.foreground", palette.inlay),
  "icon.muted": toZedColor(palette.muted),
  "icon.placeholder": color("editorLineNumber.foreground", palette.placeholder),
  ignored: color("editorInlayHint.foreground", palette.inlay),
  "ignored.background": "#AFB2BB1a",
  "ignored.border": "#AFB2BB40",
  info: color("focusBorder", palette.accent),
  "info.background": "#526FFF1a",
  "info.border": "#526FFF40",
  "link_text.hover": token("markup.link", palette.cyan),
  modified: toZedColor(palette.gold),
  "modified.background": "#C184011a",
  "modified.border": "#C1840140",
  "pane.focused_border": color("focusBorder", palette.accent),
  "pane_group.border": color("editorGroup.border", palette.border),
  "panel.background": color("sideBar.background", palette.panel),
  "panel.focused_border": color("focusBorder", palette.accent),
  "panel.indent_guide": color("editorIndentGuide.background", "#383A4233"),
  "panel.indent_guide_active": color("editorIndentGuide.activeBackground", "#626772"),
  "panel.indent_guide_hover": color("editorIndentGuide.activeBackground", "#626772"),
  players: [
    { cursor: color("focusBorder", palette.accent), background: color("focusBorder", palette.accent), selection: "#526FFF3d" },
    { cursor: toZedColor(palette.red), background: toZedColor(palette.red), selection: "#E456493d" },
    { cursor: toZedColor(palette.gold), background: toZedColor(palette.gold), selection: "#C184013d" },
    { cursor: toZedColor(palette.magenta), background: toZedColor(palette.magenta), selection: "#A626A43d" },
    { cursor: toZedColor(palette.cyan), background: toZedColor(palette.cyan), selection: "#0184BC3d" },
    { cursor: toZedColor(palette.green), background: toZedColor(palette.green), selection: "#50A14F3d" },
  ],
  predictive: color("editorInlayHint.foreground", palette.inlay),
  "predictive.background": color("editorInlayHint.background", "#F5F5F5"),
  "predictive.border": "#AFB2BB40",
  renamed: color("focusBorder", palette.accent),
  "renamed.background": "#526FFF1a",
  "renamed.border": "#526FFF40",
  "scrollbar.thumb.background": color("scrollbarSlider.background", "#4E566680"),
  "scrollbar.thumb.border": "#00000000",
  "scrollbar.thumb.hover_background": color("scrollbarSlider.hoverBackground", "#5A637580"),
  "scrollbar.track.background": "#00000000",
  "scrollbar.track.border": "#00000000",
  "search.active_match_background": "#C1840166",
  "search.match_background": color("editor.findMatchHighlightBackground", "#526FFF33"),
  "status_bar.background": color("statusBar.background", palette.panel),
  success: color("extensionButton.prominentBackground", palette.green),
  "success.background": "#50A14F1a",
  "success.border": "#50A14F40",
  "surface.background": color("sideBar.background", palette.panel),
  syntax,
  "tab.active_background": color("tab.activeBackground", palette.editor),
  "tab.inactive_background": color("tab.inactiveBackground", palette.panel),
  "tab_bar.background": color("editorGroupHeader.tabsBackground", palette.panel),
  "terminal.ansi.background": color("editor.background", palette.editor),
  "terminal.ansi.black": toZedColor(palette.primary),
  "terminal.ansi.blue": toZedColor(palette.blue),
  "terminal.ansi.bright_black": toZedColor(palette.muted),
  "terminal.ansi.bright_blue": "#6B83EDff",
  "terminal.ansi.bright_cyan": "#0BBBD6ff",
  "terminal.ansi.bright_green": "#4CC263ff",
  "terminal.ansi.bright_magenta": "#B33AB1ff",
  "terminal.ansi.bright_red": "#F06A5Dff",
  "terminal.ansi.bright_white": "#ffffffff",
  "terminal.ansi.bright_yellow": "#D7A215ff",
  "terminal.ansi.cyan": toZedColor(palette.cyan),
  "terminal.ansi.dim_black": "#9D9D9Fff",
  "terminal.ansi.dim_blue": "#2F5CB8ff",
  "terminal.ansi.dim_cyan": "#016B99ff",
  "terminal.ansi.dim_green": "#3E7F3Dff",
  "terminal.ansi.dim_magenta": "#7E1D7Cff",
  "terminal.ansi.dim_red": "#B43D33ff",
  "terminal.ansi.dim_white": "#C9C9CAff",
  "terminal.ansi.dim_yellow": "#7A5400ff",
  "terminal.ansi.green": toZedColor(palette.green),
  "terminal.ansi.magenta": toZedColor(palette.magenta),
  "terminal.ansi.red": toZedColor(palette.red),
  "terminal.ansi.white": color("editor.background", palette.editor),
  "terminal.ansi.yellow": toZedColor(palette.gold),
  "terminal.background": color("editor.background", palette.editor),
  "terminal.bright_foreground": color("editor.foreground", palette.primary),
  "terminal.dim_foreground": color("editorLineNumber.foreground", palette.placeholder),
  "terminal.foreground": color("editor.foreground", palette.primary),
  text: color("editor.foreground", palette.primary),
  "text.accent": color("focusBorder", palette.accent),
  "text.disabled": color("editorInlayHint.foreground", palette.inlay),
  "text.muted": toZedColor(palette.muted),
  "text.placeholder": color("editorLineNumber.foreground", palette.placeholder),
  "title_bar.background": color("titleBar.activeBackground", palette.panel),
  "title_bar.inactive_background": color("titleBar.inactiveBackground", palette.panel),
  "toolbar.background": color("activityBar.background", palette.editor),
  unreachable: toZedColor(palette.muted),
  "unreachable.background": "#696C771a",
  "unreachable.border": "#696C7740",
  warning: toZedColor(palette.gold),
  "warning.background": "#C184011a",
  "warning.border": "#C1840140",
  "version_control.added": toZedColor(palette.green),
  "version_control.conflict_marker.ours": "#50A14F1a",
  "version_control.conflict_marker.theirs": "#526FFF1a",
  "version_control.deleted": toZedColor(palette.red),
  "version_control.modified": toZedColor(palette.gold),
  "version_control.word_added": "#50A14F59",
  "version_control.word_deleted": "#E4564959",
};

const themeFamily = {
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: "Atom One Light",
  author: vscodeTheme.author ?? "akamud",
  themes: [
    {
      name: "Atom One Light",
      appearance: "light",
      style,
    },
  ],
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(themeFamily, null, 2)}\n`);

console.log(`Wrote ${path.relative(root, outputPath)}`);
