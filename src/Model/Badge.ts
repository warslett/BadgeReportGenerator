import {BadgeRequirement} from "~/src/Model/BadgeRequirement";

export interface Badge {
  readonly badge_id: number
  readonly name: string
  readonly description: string
  readonly requirements: ReadonlyArray<BadgeRequirement>
}
