# tyto-template-agenda-semana

`agenda-semana`, a [Tyto](https://github.com/rafaelsilvalor/tyto) code template in its own
repository: the week's agenda as a 1080×1350 carousel — a cover on the first slide, then
several disciplines to a slide, each with its sessions as a date pill over a grey pill.

**This repository holds the composition only.** The logo and the signature are not here: Tyto
hands them to the template from the brand kit installed on the machine, under the manifest's
brand `azul`, and without one it draws placeholders (Tyto ADR 0063, ADR 0065). The kit's accent
colours the logo, the headings, the date pills and the arrow; without one they are azul's own
blue (Tyto ADR 0155). The example brief's sessions and names are invented copy.

## Install into Tyto

A plugin file pins the template to a release (Tyto ADR 0151). Save this as
`TYTO_HOME/plugin-files/agenda-semana.yaml` (`~/.tyto` by default), or as
`.tyto/plugin-files/agenda-semana.yaml` beside a project's briefs:

```yaml
version: 1
templates:
  agenda-semana:
    source:
      git: https://github.com/rafaelsilvalor/tyto-template-agenda-semana.git
      ref: v1.0.0
```

Tyto fetches the tag the next time it loads templates, or now with `tyto plugin sync`, and asks
once for the permission below (`--yes` approves it). To move to a later release, change `ref`.

While Tyto still ships its own `agenda-semana`, the built-in copy and this one share the name;
Tyto's TYTO-436 removes the built-in one.

Or install the default branch, as it is:

```
tyto plugin install git+https://github.com/rafaelsilvalor/tyto-template-agenda-semana.git
```

Tyto never builds what it fetches, so `dist/index.js` is committed on `main` and every release is
a tag of it. To take a change pushed here, run the same command again: installing a name that is
already installed replaces it.

A pack brings templates and no formats. Copy `templates/formats.yaml` into the project that
renders `agenda-semana`, or merge its `grid` line into the project's own. One `::lamina` is one
slide; inside it, a line with no `|` starts a discipline and every `date | title | professor`
line under it is one of that discipline's sessions:

```
---
template: agenda-semana
formats: [grid]
imagem: ./calendario.png
---

::titulo
  AGENDA DA SEMANA

::lamina
  DISCIPLINA
  16/09 - 14:00 | Título da aula | Profª. Nome

::lamina
  OUTRA DISCIPLINA
  18/09 - 19:00 | Outra aula | Prof. Nome
```

`titulo` and `imagem` (the calendar illustration, optional) are drawn on the first slide only.
A title too long for its pill wraps and makes the row taller. Every slide but the last carries
the arrow. `selo: ./selo.png` glues the seal, 140 px tall, to the foot of the last slide, and
the page above shrinks by its height. `templates/agenda-semana/examples/agenda.brief` is a
complete example.

## What it may reach

| Permission        | Why                                                               |
| ----------------- | ----------------------------------------------------------------- |
| `font:CircularXX` | Every word is set in CircularXX, a licensed face (Tyto ADR 0048). |

**The install asks for it once.** Faces Tyto ships cross to a plugin freely; a face installed
on the machine crosses only under this permission.

## What a configuration may change

Nothing yet: the manifest declares no `values` (Tyto ADR 0153). The template moved from Tyto
with the same bytes, and its colours and spacing are azul's tokens in `@tyto/house-style/azul`.
A configuration may still pick the brand kit, and so the accent (Tyto ADR 0155).

## Development

`pnpm check` runs Prettier, the type checker, ESLint and the tests; `pnpm build` writes
`dist/index.js`, one ES module with every `@tyto` import inlined, which is committed and which
CI rebuilds and compares.

The azul brand's tokens, chrome and table look are `@tyto/house-style/azul`, shared with
`tyto-template-aprovados` (Tyto TYTO-476): a change to the azul look lands once, in Tyto.

The template depends on Tyto's published contract, held by GitHub Packages under the owner's
scope (Tyto ADR 0149) and aliased in `package.json`: `@tyto/house-style` draws the logo, the
signature and the seal, `@tyto/template-kit` and `@tyto/core` are what it is drawn with, and
`@tyto/plugin-api` is what loads it. The committed `.npmrc` names the scope only. GitHub asks
for a token with `read:packages` even for public packages, and it goes in your user-level
`~/.npmrc`:

```sh
gh auth refresh -s read:packages
echo '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> ~/.npmrc
NODE_AUTH_TOKEN=$(gh auth token) pnpm install
```

Or, writing nothing to `~/.npmrc`, hand pnpm the token for that one command:

```sh
pnpm install "--//npm.pkg.github.com/:_authToken=$(gh auth token)"
```

The tests, all without Tyto:

- `src/template.test.ts`: the carousel's rules on the scene — the disciplines and their
  sessions where the brief put them, the cover on the first slide only, the date pill over the
  grey pill, the marks' geometry, the signature on every slide and the arrow on all but the
  last.
- `tests/examples.test.ts`: the example brief compiled as Tyto compiles it, through
  `@tyto/template-kit/testing` (Tyto ADR 0152), against the HTML of each slide in
  `tests/__snapshots__/` — Tyto's own snapshots of the built-in copy, copied byte for byte.
- `tests/faces.test.ts`: the manifest's `faces:` are exactly the faces the example sets.
  Installed, the template measures in its plugin's process with those faces only (Tyto ADR
  0048); one left out and a long session title shrinks instead of wrapping.
- `tests/plugin.test.ts`: the built `dist/index.js`, loaded through
  `@tyto/plugin-api/testing` (Tyto ADR 0150), drawing a slide across the isolation protocol.

The `contract` workflow runs every day against the newest published contract, past the ranges
`package.json` asks for, so a Tyto release that breaks this template turns it red before
somebody installs it.
