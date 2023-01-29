import {NuxtAxiosInstance} from "@nuxtjs/axios";
import {Section} from "~/src/Model/Section";
import {Term} from "~/src/Model/Term";
import {Member} from "~/src/Model/Member";
import {Cache} from "~/src/Cache/Cache";

export class MemberRepository {
  private readonly cache: Cache<string, any>
  private readonly axios: NuxtAxiosInstance

  constructor(cache: Cache<string, any>, axios: NuxtAxiosInstance) {
    this.cache = cache
    this.axios = axios
  }

  async findMembers(section: Section, term: Term): Promise<ReadonlyArray<Member>> {
    const url = this.buildGetListOfMembersUrl(section, term)
    const response = await this.cache.resolveAsync(url, () => this.axios.get(url))
    return response.data.items as ReadonlyArray<Member>
  }

  async findMember(section: Section, term: Term, scoutid: number): Promise<Member|undefined> {
    const members = await this.findMembers(section, term)
    return members.find(item => item.scoutid == scoutid)
  }

  private buildGetListOfMembersUrl(section: Section, term: Term) {
    return '/osm/ext/members/contact/?action=getListOfMembers'
      + '&sort=dob'
      + '&sectionid=' + section!.section_id
      + '&termid=' + term!.term_id
      + '&section=' + section!.section_type
  }
}
