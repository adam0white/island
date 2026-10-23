/** HF6 supplies observed removal semantics and explicit host-task/project identity.
 * No route executor, task-specific intermediate reward, hidden world state or parameter tuning.
 * Historical HF5 construction remains available unchanged as the matched legacy control.
 */
import { adoptProjectTask, enableProjects, type ReceivedConsequence } from '@adam0white/human-framework';
import type { Cell, MindFactory, MindOptions, Observation } from '../types.ts';
import type { Offer } from './hf2.ts';
import { Hf5Mind } from './hf5.ts';

export class Hf6Mind extends Hf5Mind {
  private knownSources: { id: string; cell: Cell }[] = [];
  private prospectPlaces: { id: string; placeId?: string }[] = [];
  constructor(options: MindOptions) {
    super({ ...options, arm: options.arm ?? 'hf6' });
    if (this.name !== 'hf6-no-protection') enableProjects(this.person, { protectProgress: true });
  }

  /** A pickup removes its observed object from any prospect at that object's source. */
  private removals(targetId: string | undefined): string[] {
    if (this.name === 'hf6-learned') return [];
    const source = this.knownSources.find((item) => item.id === targetId);
    if (!source) return [];
    const placeId = `cell:${source.cell.x},${source.cell.y}`;
    return this.prospectPlaces.filter((p) => p.placeId === placeId).map((p) => p.id);
  }

  private readSources(obs: Observation): void {
    this.knownSources = this.known(obs);
    this.prospectPlaces = this.prospectPercepts(obs).flatMap((p) => (p.prospect ? [p.prospect] : []));
  }

  override offers(obs: Observation): Offer[] {
    this.readSources(obs);
    return super
      .offers(obs)
      .map((offer) =>
        offer.input.startsWith('pick ') ? { ...offer, diminishes: this.removals(offer.targetId) } : offer,
      );
  }

  protected override prepareOffers(obs: Observation, offers: Offer[]): void {
    this.readSources(obs);
    super.prepareOffers(obs, offers);
  }

  protected override projectSuccessor(
    successor: ReceivedConsequence['successor'],
  ): ReceivedConsequence['successor'] {
    const endpoint = super.projectSuccessor(successor);
    return successor.action === 'island:pick'
      ? { ...endpoint, diminishes: this.removals(successor.targetId) }
      : endpoint;
  }

  protected override adoptTask(obs: Observation, spire: Cell | null) {
    if (spire && this.name !== 'hf6-no-handoff') {
      const prospectId = `prospect:spire:cell:${spire.x},${spire.y}`;
      const adopted = adoptProjectTask(this.person, prospectId, {
        label: obs.task,
        serves: ['competence'],
        importance: 0.5,
        deadline: this.person.now + obs.stepsLeft,
        temporal: { halfLifeMinutes: 60 },
        advancedBy: [{ action: 'island:place:cube@Spire', amount: 0.1 }],
      });
      if (adopted) return adopted;
    }
    return super.adoptTask(obs, spire);
  }
}
const createMind: MindFactory = (options) => new Hf6Mind(options);
export default createMind;
