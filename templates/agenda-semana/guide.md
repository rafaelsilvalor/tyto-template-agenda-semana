# How to write an `agenda-semana` brief

`agenda-semana` is the week's class agenda as a carousel. The cover (title and calendar) is on
the first slide only; the classes are grouped by subject, several subjects to a slide.

## Slots

| Slot     | Where                          | Rule                                                                                                                                              |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `titulo` | directive                      | **Required**, at most 40 characters: the cover's words, usually `AGENDA DA SEMANA`. First slide only.                                             |
| `imagem` | frontmatter                    | Optional. The calendar: `imagem: ./calendario.png`. Only when the person has the file.                                                            |
| `selo`   | frontmatter                    | Optional, 1080×140, glued to the foot of the **last grid slide**: `selo: ./selo.png`. The page above shrinks by 140. Only when the person has it. |
| `lamina` | directive, repeated 1–12 times | One slide each.                                                                                                                                   |

Format: `formats: [grid]` only. Do not ask for `story` or `grid-1x1`.

## What the copy looks like

It usually arrives like this, with noise in between:

```
QUÍMICA
23/09,	08:30 - Ligações covalentes na prática
Tereza Albuquerque

Arte 2
Agenda da Semana
```

Each class is two lines: `DD/MM,<tab> HH:MM - Title` and the teacher below it. Subjects are
lines in capitals with no date. `Arte N`, `Agenda da Semana` and blank lines are noise.

## Normalisation

Inside each `::lamina`:

- **A line with no `|` opens a subject**, in CAPITALS: `QUÍMICA`.
- **Each class is one line `date | title | teacher`** under its subject.
- **Date:** `23/09,	14:00` becomes `23/09 - 14:00` (no comma, `-` with one space each side).
- **Title:** literal, only trimmed at the ends. Exclamation marks, inner capitals and exam
  bodies' names stay as they came. Correcting a title is not the brief's job.
- **Teacher:** `Prof.` or `Profª.` by the **first name**, and the name in corrected case
  (`Caio mendes` → `Prof. Caio Mendes`; `HELENA DE SOUZA` → `Profª. Helena de Souza`, with
  connectives in lower case). Always `Profª.`, never `Profa.` or `Professora`.
- **Ambiguous name** (unisex such as Ariel, Darci, Alex, Andrea; an uncommon foreign name;
  initials): write `Prof(ª).` and ask after the brief. Getting a teacher's gender wrong on a
  published piece costs more than a question.
- **More than one teacher** in a class (separated by `e`, a comma, a slash or `&`): one line,
  in the plural. All women → `Profªs. Helena de Souza e Iara Lins`; any man →
  `Profs. Iara Lins e Caio Mendes`; three or more: commas, and `e` before the last.
- **Same subject in more than one artwork:** when the split follows the artworks, the subject
  appears on every slide where it has a class. Do not reorder classes by date; if they are out
  of order, keep them and say so.
- **Class without a teacher:** keep the class, write `Prof(ª). ?` and ask.

## How to split into slides

Follow "Arte 1 / Arte 2 / Arte 3" in the copy: each artwork is one `::lamina`, and what comes
before the first mark is Arte 1. Without marks, the example puts **about 4 classes per slide**
(the first also carries the cover). That comes from the example, not from a measure: with
more, propose a split and ask.

## Example

Copy (invented):

```
QUÍMICA
22/09,	14:00 - Revisão de estequiometria
Helena de Souza
24/09,	14:00 - Questões de termoquímica
Caio mendes

Arte 2
Agenda da Semana

BIOLOGIA
25/09,	08:30 - Genética em 40 questões
Iara Lins
27/09,	18:00 - Ecologia para a prova
Iara Lins e Otávio Reis
```

Brief:

```brief
---
template: agenda-semana
formats: [grid]
---
::titulo
  AGENDA DA SEMANA

::lamina
  QUÍMICA
  22/09 - 14:00 | Revisão de estequiometria | Profª. Helena de Souza
  24/09 - 14:00 | Questões de termoquímica | Prof. Caio Mendes

::lamina
  BIOLOGIA
  25/09 - 08:30 | Genética em 40 questões | Profª. Iara Lins
  27/09 - 18:00 | Ecologia para a prova | Profs. Iara Lins e Otávio Reis
```

## Known traps

- `|` separates fields: a title with a `|` inside breaks the class. Replace it with `-` and
  say so.
- There is no subtitle slot and no separate teacher slot: everything about a class goes on
  its one line.
- The old format was `retrato`; today it is `grid`.
