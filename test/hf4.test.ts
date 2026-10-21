import { planRoute } from '@adam0white/human-framework';
import { expect, it } from 'vitest';
import { Hf4Mind } from '../src/minds/hf4.ts';
import { PERSONA } from '../src/types.ts';
import { createWorld, observe } from '../src/world.ts';

it('links a real movement offer through pick and carry to Spire placement', () => {
  const mind = new Hf4Mind({ seed: 1, persona: PERSONA });
  const world = createWorld(1);
  world.me = { x: 3, y: 5 };
  world.spire = { x: 5, y: 5 };
  world.objects = [{ id: 'cube-1', kind: 'cube', at: { x: 4, y: 5 }, level: 0 }];
  for (const row of world.height) row.fill(1);
  const obs = observe(world, 'Put cubes on the Spire.');
  obs.actions = obs.actions.filter((a) => a.id === 'move E');
  const step = mind.step(obs);
  expect(mind.name).toBe('hf4');
  expect(mind.person.planning?.depth).toBe(4);
  expect(mind.person.curiosity).toBeDefined();
  const offer = mind.offers(obs)[0];
  expect(offer).toBeDefined();
  if (!offer) throw new Error('missing test offer');
  const route = planRoute(mind.person, offer, 720);
  expect(route?.steps.map((s) => s.successor.action)).toEqual([
    'island:pick',
    'island:move',
    'island:place:cube@Spire',
  ]);
  expect(step.inner?.route).toBeDefined();
  expect(step.inner?.curiosityTerms).toBeDefined();
  expect(mind.person.agenda.goals[0]?.progress).toBe(0);
});

it('keeps chains cube-specific, invalidates old slots, and seeds the same free/task semantics', () => {
  const world = createWorld(1);
  const free = new Hf4Mind({ seed: 1, persona: PERSONA });
  const task = new Hf4Mind({ seed: 1, persona: PERSONA });
  free.step(observe(world));
  task.step(observe(world, 'Put cubes on the Spire.'));
  expect(free.person.prospection).toEqual(task.person.prospection);
  for (const e of free.person.prospection?.entries ?? []) {
    if (e.trigger.action === 'island:move' && e.successor.action === 'island:place:cube@Spire')
      expect(e.trigger.targetId).toBe(e.successor.targetId);
  }
  const next = observe(world);
  next.seen = { ...next.seen, things: [], spire: null };
  free.person.memory.episodes = [];
  free.step(next);
  expect((free.person.prospection?.entries ?? []).every((e) => e.expiresAt <= 721)).toBe(true);
});

it('switches only the named faculty within the HF4 arms', () => {
  const noCuriosity = new Hf4Mind({ seed: 1, persona: PERSONA, arm: 'hf4-no-curiosity' });
  const noPlanning = new Hf4Mind({ seed: 1, persona: PERSONA, arm: 'hf4-no-planning' });
  expect(noCuriosity.person.curiosity).toBeUndefined();
  expect(noCuriosity.person.planning?.depth).toBe(4);
  expect(noPlanning.person.curiosity).toBeDefined();
  expect(noPlanning.person.planning).toBeUndefined();
});

it('does not claim distant Spire placement after a carrying move away from it', () => {
  const mind = new Hf4Mind({ seed: 1, persona: PERSONA });
  const world = createWorld(1);
  world.me = { x: 3, y: 5 };
  world.spire = { x: 6, y: 5 };
  for (const row of world.height) row.fill(1);
  world.carrying = 'cube-1';
  world.objects = [{ id: 'cube-1', kind: 'cube', at: null, level: 0 }];
  const obs = observe(world);
  mind.step(obs);
  const away = mind.offers(obs).find((o) => o.input === 'move W');
  if (!away) throw new Error('missing away offer');
  expect(
    mind.person.prospection?.entries.some(
      (e) =>
        e.trigger.action === away.action &&
        e.trigger.targetId === away.targetId &&
        e.trigger.placeId === away.placeId &&
        e.successor.action === 'island:place:cube@Spire',
    ),
  ).toBe(false);
});
