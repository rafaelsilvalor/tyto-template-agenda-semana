import { measureNothing } from '@tyto/core';
import { pillTable } from '@tyto/template-kit';
import { describe, expect, it } from 'vitest';

import { sessionTable } from './presets.js';
import { INK } from './tokens.js';

import type { Inline, RichText } from '@tyto/core';
import type { NodeDraft } from '@tyto/core/template';

/**
 * The azul preset, drawn. The pixels are proven by rendering `sessionTable` through the
 * example brief (`tests/examples.test.ts`). What is pinned here is structure — the words go
 * where the brief put them.
 */

let cursor = 0;

function rich(source: string): RichText {
  const parts: Inline[] = [];
  for (const [index, line] of source.split('\n').entries()) {
    if (index > 0) parts.push({ kind: 'break', range: { start: cursor, end: cursor++ } });
    const start = cursor;
    cursor += line.length;
    parts.push({ kind: 'text', value: line, range: { start, end: cursor } });
  }
  return parts;
}

function walk(draft: NodeDraft): NodeDraft[] {
  return draft.kind === 'group' ? [draft, ...draft.children.flatMap(walk)] : [draft];
}

function words(draft: NodeDraft, name: string): string[] {
  return walk(draft)
    .filter((node) => node.name === name)
    .map((node) =>
      node.kind === 'text'
        ? node.runs.map((run) => (run.kind === 'text' ? run.text : '')).join('')
        : '',
    );
}

const WIDTH = 940;

describe('sessionTable', () => {
  it('reads a discipline heading and its sessions out of one slot', () => {
    const table = pillTable(sessionTable(INK), {
      text: rich('FARMÁCIA\n16/09 - 14:00 | Farmacologia Geral | Profª. Marcela Rocha'),
      width: WIDTH,
      measure: measureNothing,
    });

    expect(words(table.draft, 'discipline')).toEqual(['FARMÁCIA']);
    expect(words(table.draft, 'date')).toEqual(['16/09 - 14:00']);
    expect(words(table.draft, 'session-title')).toEqual(['Farmacologia Geral']);
    expect(words(table.draft, 'professor')).toEqual(['Profª. Marcela Rocha']);
  });
});
