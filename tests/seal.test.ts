import { readFileSync } from 'node:fs';

import { defineTemplate, parseFormats, parseManifest } from '@tyto/core';
import { SEAL_HEIGHT } from '@tyto/house-style';
import { BAND } from '@tyto/house-style/azul';
import { compileTemplate } from '@tyto/template-kit/testing';
import { describe, expect, it } from 'vitest';

import { build } from '../src/template.js';

import type { AssetRef, AssetResolver, Frame, SceneNode, TemplateFiles } from '@tyto/core';

/**
 * The house's seal (TYTO-201), offered the way every house template with a grid offers it
 * (TYTO-480): `selo:` in the frontmatter glues an art 1080 × 140 to the last slide's foot, the
 * page above shrinks by it, and the footer — the signature and the arrow — stands on the seal.
 *
 * The example brief is compiled twice, as it is and with `selo:` added, with the resolvers
 * `examples.test.ts` uses, so the seal-less half is the snapshot that test already holds.
 */

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');

function valueOf<T>(result: { ok: true; value: T } | { ok: false; error: unknown }): T {
  if (!result.ok) throw new Error(JSON.stringify(result.error, undefined, 2));
  return result.value;
}

function refAt(path: string): AssetRef {
  return { id: path, source: 'file', path, hash: `test-${path}` };
}

const assets: AssetResolver = {
  base: '(seal test)',
  resolve: (reference) => Promise.resolve(refAt(reference)),
};
const files: TemplateFiles = { svg: () => undefined, image: refAt };

const manifest = valueOf(
  parseManifest(read('../templates/agenda-semana/manifest.yaml'), 'manifest.yaml'),
);
const template = defineTemplate(manifest, build, files);
const formats = valueOf(parseFormats(read('../templates/formats.yaml'), 'formats.yaml'));
const example = read('../templates/agenda-semana/examples/agenda.brief');

async function compiled(brief: string) {
  return valueOf(
    await compileTemplate({
      brief,
      template,
      formats,
      assets,
      asset: (ref: AssetRef) => `tyto-test-asset:${ref.id}`,
    }),
  );
}

const sealed = () =>
  compiled(example.replace('formats: [grid]', 'formats: [grid]\nselo: ./selo.png'));

const frames = (scene: { artworks: readonly { frames: readonly Frame[] }[] }): Frame[] =>
  scene.artworks.flatMap((artwork) => artwork.frames);

const top = (frame: Frame | undefined, name: string): SceneNode | undefined =>
  frame?.children.find((node) => node.name === name);

describe('the seal', () => {
  const sealTop = 1350 - SEAL_HEIGHT;

  it('glues the seal, 1080 × 140, to the last slide’s foot and to no other', async () => {
    const [first, last] = frames((await sealed()).scene);
    const seal = top(last, 'seal');

    expect(top(first, 'seal')).toBeUndefined();
    expect(seal?.transform).toMatchObject({ x: 0, y: sealTop });
    expect(seal !== undefined && 'size' in seal ? seal.size : undefined).toEqual({
      w: 1080,
      h: SEAL_HEIGHT,
    });
  });

  it('stands the footer on the seal: it rises by the band and ends above it', async () => {
    const [, open] = frames((await compiled(example)).scene);
    const [, closed] = frames((await sealed()).scene);
    const footerY = (frame: Frame | undefined) => top(frame, 'footer')?.transform.y ?? Number.NaN;

    expect(footerY(open) - footerY(closed)).toBe(SEAL_HEIGHT);
    expect(footerY(closed) + BAND.footer).toBeLessThanOrEqual(sealTop);
  });

  it('leaves the slides before the last byte for byte as a seal-less brief draws them', async () => {
    const open = (await compiled(example)).frames;
    const closed = (await sealed()).frames;

    expect(closed[0]?.html).toBe(open[0]?.html);
    expect(closed[1]?.html).not.toBe(open[1]?.html);
    expect(closed[1]?.html).toContain('data-name="seal"');
  });
});
