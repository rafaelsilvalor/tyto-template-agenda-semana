/**
 * The azul brand's configurations of the kit's components (ADR 0047).
 *
 * A preset is a component in this brand's look: which columns, which pills, which colours.
 * It holds no number of its own — every size is a token — so changing the look of every
 * azul table is a change to `tokens.ts`, and changing what a table *is* is a change here.
 */

import {
  BLACK,
  COVER,
  COVER_INK,
  FACE,
  GAP,
  LIGHT,
  MEDIUM,
  ON_INK,
  PILL,
  PILL_INK,
  RADIUS,
  TABLE,
  TYPE,
} from './tokens.js';

import type { LabelColumn, PillTableStyle, TextStyle, TitleBlockStyle } from '@tyto/template-kit';

const style = (size: number, weight: number, color: string): TextStyle => ({
  font: FACE,
  size,
  weight,
  color,
});

/** The blue pill on the left of a row, holding one field centred on the row. */
function badge(options: {
  readonly accent: string;
  readonly name: string;
  readonly text: string;
  readonly width: number;
  readonly radius: number;
  readonly style: TextStyle;
}): LabelColumn {
  return {
    kind: 'label',
    name: options.name,
    width: options.width,
    shape: { fill: options.accent, radius: options.radius },
    text: {
      name: options.text,
      style: options.style,
      align: 'center',
      valign: 'middle',
    },
  };
}

/* ------------------------------------------------------------------------ the agenda -- */

/**
 * The agenda's sessions: `date | title | professor`, grouped under discipline headings.
 *
 * The grey pill runs the full width of the row and the blue date pill is laid over its left
 * end, as the published slide draws the two — one shape, no gap between them. A title that
 * wraps makes its pill, and the row, taller (TYTO-184).
 */
export function sessionTable(accent: string): PillTableStyle {
  return {
    layering: 'overlap',
    rowGap: GAP.sessions,
    minRowHeight: TABLE.badge.h,
    columns: [
      badge({
        accent,
        name: 'date-pill',
        text: 'date',
        width: TABLE.badge.w,
        radius: RADIUS,
        style: style(TYPE.date, MEDIUM, ON_INK),
      }),
      {
        kind: 'lines',
        name: 'session-pill',
        width: 'fill',
        shape: { fill: PILL, radius: RADIUS },
        padding: TABLE.padding,
        lineGap: TABLE.lineGap,
        lines: [
          {
            name: 'session-title',
            style: style(TYPE.sessionTitle, MEDIUM, PILL_INK),
            minHeight: TABLE.line.title,
          },
          {
            name: 'professor',
            style: style(TYPE.professor, LIGHT, PILL_INK),
            minHeight: TABLE.line.professor,
          },
        ],
      },
    ],
    groups: {
      heading: {
        name: 'discipline',
        height: TABLE.heading,
        style: style(TYPE.discipline, MEDIUM, accent),
        align: 'center',
        overflow: 'shrink',
      },
      headingGap: GAP.heading,
      gap: GAP.disciplines,
    },
    names: { table: 'session-table', group: 'discipline-group', rows: 'sessions', row: 'session' },
  };
}

/** The agenda's cover: the calendar illustration over the cover words. */
export const coverTitle: TitleBlockStyle = {
  name: 'cover',
  parts: [
    {
      kind: 'image',
      field: 'imagem',
      name: 'illustration',
      size: { w: COVER.illustration, h: COVER.illustration },
    },
    {
      kind: 'text',
      field: 'titulo',
      name: 'cover-title',
      style: style(TYPE.cover, BLACK, COVER_INK),
      height: Math.round(TYPE.cover * COVER.boxRatio),
      lineHeight: COVER.lineHeight,
      gapAbove: COVER.illustrationGap,
    },
  ],
};
