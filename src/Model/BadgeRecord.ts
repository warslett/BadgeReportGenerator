export class BadgeRecord {
  readonly completed: boolean
  readonly awarded: boolean
  readonly requirements: ReadonlyMap<number, string>

  constructor(completed: boolean, awarded: boolean, requirements: Map<number, string>) {
    this.completed = completed;
    this.awarded = awarded;
    this.requirements = requirements;
  }

  public getRequirement(field: number): string|undefined {
    return this.requirements.get(field)
  }

  public hasRequirement(field: number): boolean {
    return this.requirements.has(field) && this.requirements.get(field) != undefined
  }
}
