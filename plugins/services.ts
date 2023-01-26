import {MemberRepository} from "~/src/Repository/MemberRepository";
import {NuxtAxiosInstance} from "@nuxtjs/axios";
import {InMemoryCache} from "~/src/Cache/InMemoryCache";

export default ({ $axios }: { $axios: NuxtAxiosInstance }, inject: (name: string, service: any) => void) => {
  inject('members', new MemberRepository(new InMemoryCache<string, any>(), $axios))
}
