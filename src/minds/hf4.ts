/** HF4: HF3's person and lived outcomes, with opt-in curiosity and bounded planning.
 * Seeded semantics use current sight and HF recall only. Routes are estimates, never executors. */
import {
  type Affordance,
  type Considered,
  enableCuriosity,
  enablePlanning,
  type Percept,
  planRoute,
  type ReceivedConsequence,
  recall,
  seedConsequences,
} from '@adam0white/human-framework';
import type { Cell, Inner, MindFactory, MindOptions, Observation } from '../types.ts';
import { Hf2Mind, type Offer } from './hf2.ts';

const place = (c: Cell) => `cell:${c.x},${c.y}`;
const distance = (a: Cell, b: Cell) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const directions: Record<string, Cell> = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
};
const identity = (a: Pick<Affordance, 'action' | 'targetId' | 'placeId'>) => ({
  action: a.action,
  targetId: a.targetId,
  placeId: a.placeId,
});

export class Hf4Mind extends Hf2Mind {
  override readonly name: string;
  get hfVersion(): string {
    return this.person.engine;
  }
  private previousSlots = 0;
  constructor(options: MindOptions) {
    super({ ...options, consequences: true });
    this.name = String(options.arm ?? 'hf4');
    if (this.name !== 'hf4-no-curiosity') enableCuriosity(this.person);
    if (this.name !== 'hf4-no-planning') enablePlanning(this.person, { depth: 4 });
  }

  // HF4 replaces HF3's one-hop testimony with the same seeded chains in all three arms.
  protected override consequencePercepts(_obs: Observation): Percept[] {
    return [];
  }

  protected known(obs: Observation): { id: string; cell: Cell }[] {
    const out = obs.seen.things.map((t) => ({
      id: t.id,
      cell: { x: this.here.x + t.dx, y: this.here.y + t.dy },
    }));
    if (obs.seen.spire)
      out.push({
        id: 'Spire',
        cell: { x: this.here.x + obs.seen.spire.dx, y: this.here.y + obs.seen.spire.dy },
      });
    const seen = new Set([...out.map((t) => t.id), obs.seen.carrying]);
    const episodes = recall(this.person, { action: 'island-object', limit: 256 })
      .filter((e) => e.action === 'island-object' && e.targetId && e.placeId)
      .sort((a, b) => b.at - a.at || b.id.localeCompare(a.id, undefined, { numeric: true }));
    for (const ep of episodes) {
      if (!ep.targetId || !ep.placeId || seen.has(ep.targetId)) continue;
      const [x, y] = ep.placeId.slice(5).split(',').map(Number);
      if (x === undefined || y === undefined) continue;
      seen.add(ep.targetId);
      out.push({ id: ep.targetId, cell: { x, y } });
    }
    return out;
  }

  override offers(obs: Observation): Offer[] {
    const offers = super.offers(obs);
    const spire = this.known(obs).find((t) => t.id === 'Spire');
    // Stable carrying identity permits a retained carry -> place link. No extra legal inputs.
    // This applies without a task, and changes no effort, reward or goal advances.
    if (obs.seen.carrying && spire)
      for (const offer of offers) {
        const [verb, direction = ''] = offer.input.split(' ');
        const d = directions[direction];
        if (
          verb === 'move' &&
          d &&
          distance({ x: this.here.x + d.x, y: this.here.y + d.y }, spire.cell) <
            distance(this.here, spire.cell)
        ) {
          offer.targetId = obs.seen.carrying;
          offer.placeId = place(spire.cell);
          offer.fromMemory = !obs.seen.spire;
        }
      }
    return offers;
  }

  protected override prepareOffers(obs: Observation, offers: Offer[]): void {
    const known = this.known(obs);
    const spire = known.find((t) => t.id === 'Spire');
    const claims: ReceivedConsequence[] = [];
    const now = this.person.now;
    const push = (
      trigger: ReceivedConsequence['trigger'],
      successor: ReceivedConsequence['successor'],
      from: number,
      chance: number,
    ) => {
      if (claims.length >= 64) return;
      claims.push({
        id: `chain-${String(claims.length).padStart(2, '0')}`,
        revision: now,
        trigger,
        successor: this.projectSuccessor(successor),
        availableFrom: from,
        availableUntil: from + successor.duration + 1,
        expiresAt: from + successor.duration + 1,
        chance,
        confidence: 1,
      });
    };
    const successor = (action: string, targetId: string, cell: Cell, duration = 1, effort = 0) => ({
      action,
      targetId,
      placeId: place(cell),
      duration,
      effort,
      focus: 0.03,
    });
    for (const cube of known.filter((t) => t.id.startsWith('cube-'))) {
      if (obs.seen.carrying) continue;
      const pick = successor('island:pick', cube.id, cube.cell);
      const walk = distance(this.here, cube.cell);
      for (const offer of offers) {
        const [verb, direction = ''] = offer.input.split(' ');
        const d = directions[direction];
        if (!['move', 'jump'].includes(verb ?? '') || !d || walk < 1) continue;
        if (distance({ x: this.here.x + d.x, y: this.here.y + d.y }, cube.cell) >= walk) continue;
        // Earliest all-the-way arrival, not a claim that one input teleports the body.
        push(identity(offer), pick, now + walk, walk === 1 ? 1 : 0.7);
      }
      const actualPicks = offers.filter((o) => o.input === `pick ${cube.id}`);
      const picks = [identity(pick), ...actualPicks.map(identity)].filter(
        (p, i, all) => all.findIndex((q) => JSON.stringify(p) === JSON.stringify(q)) === i,
      );
      if (!spire) continue;
      for (const trigger of picks) {
        // Actual adjacent pickup keeps the current body position.
        const immediate = actualPicks.some((o) => JSON.stringify(identity(o)) === JSON.stringify(trigger));
        const body = immediate ? this.here : cube.cell;
        const travel = distance(body, spire.cell);
        const carry = successor('island:move', cube.id, spire.cell, Math.max(1, travel), 0.08);
        if (travel === 0)
          push(trigger, successor('island:place:cube@Spire', cube.id, spire.cell, 1, 0.08), now + 1, 1);
        else {
          push(trigger, carry, now + (immediate ? 1 : walk + 1), 0.7);
          push(
            identity(carry),
            successor('island:place:cube@Spire', cube.id, spire.cell, 1, 0.08),
            now + (immediate ? 1 : walk + 1) + Math.max(1, travel),
            0.7,
          );
        }
      }
    }
    if (obs.seen.carrying?.startsWith('cube-') && spire) {
      for (const offer of offers.filter(
        (o) =>
          o.action === 'island:move' && o.targetId === obs.seen.carrying && o.placeId === place(spire.cell),
      )) {
        const travel = distance(this.here, spire.cell);
        push(
          identity(offer),
          successor('island:place:cube@Spire', obs.seen.carrying, spire.cell, 1, 0.08),
          now + travel,
          travel === 1 ? 1 : 0.7,
        );
      }
    }
    // Retain HF3's immediate placement semantics for cubes, rock and ring as known facts.
    for (const percept of super.consequencePercepts(obs))
      for (const claim of percept.consequences ?? [])
        push(claim.trigger, claim.successor, claim.availableFrom, claim.chance);
    // Supersede unused slots before current claims: old body-relative knowledge must not survive.
    const stale: ReceivedConsequence[] = [];
    for (let i = claims.length; i < this.previousSlots; i++)
      stale.push({
        id: `chain-${String(i).padStart(2, '0')}`,
        revision: now,
        trigger: { action: 'island:expired' },
        successor: { action: 'island:expired', duration: 1, effort: 0 },
        availableFrom: now,
        availableUntil: now,
        expiresAt: now,
        chance: 0,
        confidence: 0,
      });
    for (let i = 0; i < stale.length; i += 4)
      if (!seedConsequences(this.person, 'island', stale.slice(i, i + 4)))
        throw new Error('Island invalidation rejected');
    this.previousSlots = claims.length;
    // Batch 4 works for both the planning and nonplanning retention limits.
    for (let i = 0; i < claims.length; i += 4)
      if (!seedConsequences(this.person, 'island', claims.slice(i, i + 4)))
        throw new Error('Island chain seed rejected');
  }

  /** Subclasses may attach endpoint semantics without changing the seeded generator. */
  protected projectSuccessor(successor: ReceivedConsequence['successor']): ReceivedConsequence['successor'] {
    return successor;
  }

  protected override offerReading(offer: Offer, chosen: Considered): Inner {
    return {
      route: planRoute(this.person, offer) ?? { steps: [], goals: {} },
      curiosityTerms: chosen.terms.filter((t) => t.source.startsWith('curiosity:')),
    };
  }
}
const createMind: MindFactory = (options) => new Hf4Mind(options);
export default createMind;
