import { readFileSync } from 'node:fs';

import { defineTemplate, parseFormats, parseManifest } from '@tyto/core';
import { compileTemplate } from '@tyto/template-kit/testing';
import { describe, expect, it } from 'vitest';

import { build } from '../src/template.js';

import type { AssetRef } from '@tyto/core';

/**
 * The faces the manifest declares are the faces the agenda sets.
 *
 * Installed, the template runs in its plugin's own process, and `measure` there knows only the
 * faces the manifest lists under `faces:` (Tyto ADR 0048). A face left out measures as nothing,
 * so a long session title is not wrapped but shrunk, and the slide draws differently from the
 * built-in copy, which measured in Tyto's process with every face. Neither the snapshot test nor
 * the plugin test sees it: both run without faces.
 */

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');

function valueOf<T>(result: { ok: true; value: T } | { ok: false; error: unknown }): T {
  if (!result.ok) throw new Error(JSON.stringify(result.error, undefined, 2));
  return result.value;
}

const refAt = (path: string): AssetRef => ({ id: path, source: 'file', path, hash: path });

/** Every `family weight` a text span in the value sets, wherever it sits. */
function facesIn(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) facesIn(item, found);
  } else if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>;
    const font = record['font'] as { family?: unknown } | undefined;
    if (record['kind'] === 'text' && typeof font?.family === 'string') {
      found.add(`${font.family} ${String(record['weight'])}`);
    }
    for (const item of Object.values(record)) facesIn(item, found);
  }
  return found;
}

describe('the faces the manifest declares', () => {
  it('are every face the example brief sets, and no other', async () => {
    const manifest = valueOf(
      parseManifest(read('../templates/agenda-semana/manifest.yaml'), 'manifest.yaml'),
    );
    const compiled = valueOf(
      await compileTemplate({
        brief: read('../templates/agenda-semana/examples/agenda.brief'),
        template: defineTemplate(manifest, build, { svg: () => undefined, image: refAt }),
        formats: valueOf(parseFormats(read('../templates/formats.yaml'), 'formats.yaml')),
        assets: { base: '(faces test)', resolve: (reference) => Promise.resolve(refAt(reference)) },
      }),
    );

    const declared = (manifest.faces ?? []).map((face) => `${face.family} ${face.weight}`);
    expect([...facesIn(compiled.scene)].sort()).toEqual(declared.sort());
  });
});
