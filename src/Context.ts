import {Context as NuxtContext} from "@nuxt/types";
import {MemberRepository} from "~/src/Repository/MemberRepository";
export interface Context extends NuxtContext {
  readonly $members: MemberRepository
}
