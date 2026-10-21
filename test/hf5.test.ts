import { remember } from '@adam0white/human-framework';
import { expect, it } from 'vitest';
import { Hf5Mind } from '../src/minds/hf5.ts';
import { PERSONA } from '../src/types.ts';
import { createWorld, observe } from '../src/world.ts';

it('builds identical prospects without a task property, and never accesses it', () => {
  const mind = new Hf5Mind({ seed: 1, persona: PERSONA });
  const obs = observe(createWorld(1));
  const stripped = { ...obs };
  Reflect.deleteProperty(stripped, 'task');
  const expected = mind.prospectPercepts(obs);
  Object.defineProperty(stripped, 'task', {
    get() {
      throw new Error('task read');
    },
  });
  expect(mind.prospectPercepts(stripped)).toEqual(expected);
  expect(expected.some((p) => p.prospect?.label === 'a pile on the Spire')).toBe(true);
});

it('reports only visible progress, with known cubes as its denominator', () => {
  const mind = new Hf5Mind({ seed: 1, persona: PERSONA });
  const world = createWorld(1);
  world.me = { x: 3, y: 5 };
  world.spire = { x: 5, y: 5 };
  world.objects = [
    { id: 'cube-1', kind: 'cube', at: { x: 5, y: 5 }, level: 0 },
    { id: 'cube-2', kind: 'cube', at: { x: 4, y: 5 }, level: 0 },
    { id: 'ring', kind: 'ring', at: { x: 5, y: 5 }, level: 0 },
  ];
  const obs = observe(world);
  expect(mind.prospectPercepts(obs).map((p) => p.prospect?.progress)).toEqual([0.5, 1]);
  // Remembered absolute adapter cells, with no current sight of either place.
  for (const id of ['Spire', 'ring'])
    remember(mind.person, {
      kind: 'island-object',
      action: 'island-object',
      at: 720,
      targetId: id,
      placeId: 'cell:2,0',
      valence: 0,
      summary: id,
      tags: [],
      salience: 0.5,
    });
  obs.seen.spire = null;
  obs.seen.things = [];
  const recalled = mind.prospectPercepts(obs);
  expect(recalled).toHaveLength(2);
  for (const p of recalled) expect(p.prospect).not.toHaveProperty('progress');
});

it('enables exactly the specified faculties in all three arms', () => {
  for (const arm of ['hf5', 'hf5-no-projects', 'hf5-no-persistence']) {
    const mind = new Hf5Mind({ seed: 1, persona: PERSONA, arm });
    expect(mind.name).toBe(arm);
    expect(mind.person.curiosity).toBeDefined();
    expect(mind.person.planning?.depth).toBe(4);
    expect(!!mind.person.projects).toBe(arm !== 'hf5-no-projects');
    expect(!!mind.person.pursuit).toBe(arm !== 'hf5-no-persistence');
  }
});

it('links only placement endpoints to projects and preserves task links', () => {
  const mind = new Hf5Mind({ seed: 1, persona: PERSONA });
  const world = createWorld(1);
  world.me = { x: 3, y: 5 };
  world.spire = { x: 4, y: 5 };
  world.carrying = 'cube-1';
  world.objects = [{ id: 'cube-1', kind: 'cube', at: null, level: 0 }];
  for (const row of world.height) row.fill(1);
  mind.step(observe(world, 'Put cubes on the Spire.'));
  const task = mind.person.agenda.goals.find((g) => !g.project);
  const project = mind.person.agenda.goals.find((g) => g.project);
  expect(task?.advancedBy).toEqual([{ action: 'island:place:cube@Spire', amount: 0.1 }]);
  expect(task?.importance).toBe(0.5);
  expect(task?.temporal).toEqual({ halfLifeMinutes: 60 });
  expect(project).toBeDefined();
  const offers = mind.offers(observe(world));
  for (const o of offers) {
    expect(o.advances).not.toContain(project?.id);
    if (o.input === 'place E') expect(o.advances).toContain(project?.project?.prospectId);
    else expect(o.advances).not.toContain(project?.project?.prospectId);
  }
  for (const e of mind.person.prospection?.entries ?? []) {
    if (e.successor.advances?.length) {
      expect(e.successor.action).toMatch(/^island:place:/);
      expect(e.successor.placeId).toBe('cell:1,0');
    }
  }
});

// Full known material IDs remain the adapter contract if the framework's bound changes.
it('passes every known cube id without truncation', () => {
  const mind = new Hf5Mind({ seed: 1, persona: PERSONA });
  const world = createWorld(1);
  const obs = observe(world);
  obs.seen.things = Array.from({ length: 9 }, (_, i) => ({
    id: `cube-${i + 1}`,
    kind: 'cube' as const,
    dx: 0,
    dy: 0,
    level: i,
    inRing: false,
  }));
  expect(mind.prospectPercepts(obs)[0]?.prospect?.materialIds).toHaveLength(9);
});
