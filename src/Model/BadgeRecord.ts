import {Badge} from "~/src/Model/Badge";

export class BadgeRecord {
  readonly completed: boolean
  readonly awarded: boolean
  readonly badge: Badge
  readonly requirements: ReadonlyMap<number, string>

  constructor(completed: boolean, awarded: boolean, badge: Badge, requirements: Map<number, string>) {
    this.completed = completed;
    this.awarded = awarded;
    this.badge = badge
    this.requirements = requirements;
  }

  public getRequirement(field: number): string|undefined {
    return this.requirements.get(field)
  }

  public hasRequirement(field: number): boolean {
    return this.requirements.has(field) && this.requirements.get(field) != undefined
  }

  public getDisplayTile(): string {
    let badgeName = this.badge.name
    if (this.awarded) {
      badgeName += ' - AWARDED'
    } else if (this.completed) {
      badgeName += ' - COMPLETED'
    }
    return badgeName
  }
}
