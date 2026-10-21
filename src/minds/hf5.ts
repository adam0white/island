/** HF5 adds attended place prospects and opt-in persistence to the unchanged HF4 person. */
import {
  type Considered,
  enablePersistence,
  enableProjects,
  type Percept,
  type Prospect,
  pursuitOf,
  type ReceivedConsequence,
} from '@adam0white/human-framework';
import type { Inner, MindFactory, MindOptions, Observation, ProjectReading } from '../types.ts';
import type { Offer } from './hf2.ts';
import { Hf4Mind } from './hf4.ts';

export class Hf5Mind extends Hf4Mind {
  private currentProspects: Prospect[] = [];
  constructor(options: MindOptions) {
    super({ ...options, arm: options.arm ?? 'hf5' });
    if (this.name !== 'hf5-no-projects') enableProjects(this.person);
    if (this.name !== 'hf5-no-persistence') enablePersistence(this.person);
  }

  /** Observation/recall only. Public for the adapter's input-boundary proofs. */
  prospectPercepts(obs: Observation): Percept[] {
    const known = this.known(obs);
    const cubes = new Set(known.filter((t) => t.id.startsWith('cube-')).map((t) => t.id));
    if (obs.seen.carrying?.startsWith('cube-')) cubes.add(obs.seen.carrying);
    return known
      .filter((t) => t.id === 'Spire' || t.id === 'ring')
      .map((t) => {
        const placeId = `cell:${t.cell.x},${t.cell.y}`;
        const visible = t.id === 'Spire' ? !!obs.seen.spire : obs.seen.things.some((o) => o.id === 'ring');
        const objects = obs.seen.things.filter(
          (o) =>
            (t.id !== 'ring' || o.id !== 'ring') &&
            this.here.x + o.dx === t.cell.x &&
            this.here.y + o.dy === t.cell.y,
        ).length;
        const prospect: Prospect = {
          id: `prospect:${t.id === 'Spire' ? 'spire' : 'ring'}:${placeId}`,
          kind: 'arrange',
          label: t.id === 'Spire' ? 'a pile on the Spire' : 'fill the ring',
          placeId,
          materialIds: [...cubes],
          ...(visible ? { progress: cubes.size ? Math.min(1, objects / cubes.size) : 0 } : {}),
        };
        return {
          at: this.person.now,
          channel: 'saw',
          kind: 'island-prospect',
          targetId: t.id,
          placeId,
          salience: 0.5,
          valence: 0,
          summary: `${prospect.label} at ${placeId}${visible ? ' observed' : ' recalled'}`,
          prospect,
        };
      });
  }

  protected override consequencePercepts(obs: Observation): Percept[] {
    return this.prospectPercepts(obs);
  }

  override offers(obs: Observation): Offer[] {
    const prospects = this.prospectPercepts(obs).flatMap((p) => (p.prospect ? [p.prospect] : []));
    const projectGoals = new Set(this.person.agenda.goals.filter((g) => g.project).map((g) => g.id));
    return super.offers(obs).map((offer) => {
      // HF2's generic need links must not credit a project's pickups, moves, rest or throws.
      offer.advances = (offer.advances ?? []).filter((id) => !projectGoals.has(id));
      if (offer.input.startsWith('place '))
        offer.advances.push(...prospects.filter((p) => p.placeId === offer.placeId).map((p) => p.id));
      return offer;
    });
  }

  protected override prepareOffers(obs: Observation, offers: Offer[]): void {
    this.currentProspects = this.prospectPercepts(obs).flatMap((p) => (p.prospect ? [p.prospect] : []));
    super.prepareOffers(obs, offers);
  }

  protected override projectSuccessor(
    successor: ReceivedConsequence['successor'],
  ): ReceivedConsequence['successor'] {
    if (!successor.action.startsWith('island:place:')) return successor;
    const prospects = this.currentProspects;
    return {
      ...successor,
      advances: prospects.filter((p) => p.placeId === successor.placeId).map((p) => p.id),
    };
  }

  protected override offerReading(offer: Offer, chosen: Considered): Inner {
    const projects: ProjectReading[] = this.person.agenda.goals.flatMap((goal) => {
      if (!goal.project) return [];
      const prospect = this.person.projects?.prospects.find((p) => p.id === goal.project?.prospectId);
      return [
        {
          goalId: goal.id,
          prospectId: goal.project.prospectId,
          placeId:
            prospect?.placeId ?? goal.project.prospectId.slice(goal.project.prospectId.indexOf('cell:')),
          progress: goal.progress,
          status: goal.status,
        },
      ];
    });
    return {
      ...super.offerReading(offer, chosen),
      activeProject: projects.find((g) => g.status === 'active') ?? null,
      projects,
      pursuit: pursuitOf(this.person) ?? null,
      pursuitTerms: chosen.terms.filter((t) => t.source.startsWith('pursuit:')),
    };
  }
}
const createMind: MindFactory = (options) => new Hf5Mind(options);
export default createMind;
