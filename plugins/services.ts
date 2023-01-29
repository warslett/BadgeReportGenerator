import {MemberRepository} from "~/src/Repository/MemberRepository";
import {NuxtAxiosInstance} from "@nuxtjs/axios";
import {InMemoryCache} from "~/src/Cache/InMemoryCache";
import {BadgeRepository} from "~/src/Repository/BadgeRepository";
import {Badge} from "~/src/Model/Badge";
import {BadgeRecordRepository} from "~/src/Repository/BadgeRecordRepository";
import {BadgeRecord} from "~/src/Model/BadgeRecord";

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    readonly $members: MemberRepository
    readonly $badges: BadgeRepository
    readonly $badgeRecords: BadgeRecordRepository
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    readonly $members: MemberRepository
    readonly $badges: BadgeRepository
    readonly $badgeRecords: BadgeRecordRepository
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    readonly $members: MemberRepository
    readonly $badges: BadgeRepository
    readonly $badgeRecords: BadgeRecordRepository
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    readonly $members: MemberRepository
    readonly $badges: BadgeRepository
    readonly $badgeRecords: BadgeRecordRepository
  }
}

export default ({ $axios }: { $axios: NuxtAxiosInstance }, inject: (name: string, service: any) => void) => {
  inject('members', new MemberRepository(new InMemoryCache<string, any>(), $axios))
  inject('badges', new BadgeRepository(new InMemoryCache<string, ReadonlyArray<Badge>>(), $axios))
  inject('badgeRecords', new BadgeRecordRepository(new InMemoryCache<string, any>(), $axios, new InMemoryCache<string, BadgeRecord>()))
}
