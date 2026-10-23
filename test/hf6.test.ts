import { adoptGoal } from '@adam0white/human-framework';
import { expect, it } from 'vitest';
import { Hf6Mind } from '../src/minds/hf6.ts';
import { PERSONA } from '../src/types.ts';
import { createWorld, observe } from '../src/world.ts';

function scene() {
  const world = createWorld(1);
  for (const row of world.height) row.fill(1);
  world.me = { x: 3, y: 5 };
  world.spire = { x: 4, y: 5 };
  world.objects = [
    { id: 'cube-1', kind: 'cube' as const, at: { x: 4, y: 5 }, level: 0 },
    { id: 'cube-2', kind: 'cube' as const, at: { x: 3, y: 5 }, level: 0 },
  ];
  return world;
}

it('declares removal from the observed object source, including adjacent pickup, and does not read the task', () => {
  const mind = new Hf6Mind({ seed: 1, persona: PERSONA });
  const obs = observe(scene());
  Object.defineProperty(obs, 'task', {
    get() {
      throw new Error('task read');
    },
  });
  const offers = mind.offers(obs);
  expect(offers.find((o) => o.input === 'pick cube-1')?.diminishes).toEqual(['prospect:spire:cell:1,0']);
  expect(offers.find((o) => o.input === 'pick cube-2')?.diminishes).toEqual([]);
  expect(offers.filter((o) => !o.input.startsWith('pick ')).every((o) => !o.diminishes)).toBe(true);
});

it('learned-only ablation omits every declared removal but keeps protection enabled', () => {
  const mind = new Hf6Mind({ seed: 1, persona: PERSONA, arm: 'hf6-learned' });
  expect(mind.person.projects?.spec?.protectProgress).toBe(true);
  expect(mind.offers(observe(scene())).every((o) => !o.diminishes?.length)).toBe(true);
});

it('matching host task reuses the active project identity; no-handoff keeps separate goals', () => {
  for (const arm of ['hf6', 'hf6-no-handoff']) {
    const mind = new Hf6Mind({ seed: 1, persona: PERSONA, arm });
    const project = adoptGoal(
      mind.person,
      {
        label: 'a pile on the Spire',
        serves: ['competence'],
        importance: 0.4,
        advancedBy: [],
        project: { prospectId: 'prospect:spire:cell:1,0', perceivedProgress: true },
      },
      mind.person.now,
    );
    mind.step(observe(scene(), 'Put cubes on the Spire.'));
    const task = mind.person.agenda.goals.find((g) => g.label === 'Put cubes on the Spire.');
    expect(task).toBeDefined();
    expect(task?.id === project.id).toBe(arm === 'hf6');
  }
});
