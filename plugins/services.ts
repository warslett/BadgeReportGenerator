import {MemberRepository} from "~/src/Repository/MemberRepository";
import {NuxtAxiosInstance} from "@nuxtjs/axios";
import {InMemoryCache} from "~/src/Cache/InMemoryCache";
import {BadgeRepository} from "~/src/Repository/BadgeRepository";
import {Badge} from "~/src/Model/Badge";

export default ({ $axios }: { $axios: NuxtAxiosInstance }, inject: (name: string, service: any) => void) => {
  inject('members', new MemberRepository(new InMemoryCache<string, any>(), $axios))
  inject('badges', new BadgeRepository(new InMemoryCache<string, ReadonlyArray<Badge>>(), $axios))
}
