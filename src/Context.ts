import {Context as NuxtContext} from "@nuxt/types";
import {MemberRepository} from "~/src/Repository/MemberRepository";
import {BadgeRepository} from "~/src/Repository/BadgeRepository";
export interface Context extends NuxtContext {
  readonly $members: MemberRepository
  readonly $badges: BadgeRepository
}
