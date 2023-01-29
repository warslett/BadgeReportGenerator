import {Badge} from "~/src/Model/Badge";
import {NuxtAxiosInstance} from "@nuxtjs/axios";
import {Term} from "~/src/Model/Term";
import {Section} from "~/src/Model/Section";
import {BadgeRequirement} from "~/src/Model/BadgeRequirement";
import {Cache} from "~/src/Cache/Cache";

export class BadgeRepository {
  private readonly cache: Cache<string, ReadonlyArray<Badge>>
  private readonly axios: NuxtAxiosInstance

  constructor(cache: Cache<string, ReadonlyArray<Badge>>, axios: NuxtAxiosInstance) {
    this.cache = cache
    this.axios = axios
  }

  async findBadgesByType(section: Section, term: Term, type_id: number): Promise<ReadonlyArray<Badge>> {
    return await this.cache.resolveAsync(section.section_id + ':' + term.term_id + ':' + type_id, async () => {
      const url = this.buildGetBadgeStructureByTypeUrl(section, term, type_id)
      const badgeStructureResponse = await this.axios.get(url)

      const badgeStructureData = badgeStructureResponse.data as { details: object, structure: object }
      const detailsEntries = Object.entries(badgeStructureData.details)
      const detailsMap = new Map<string, object>(detailsEntries)
      const structureEntries = Object.entries(badgeStructureData.structure) as [string, any[]][]
      const structureMap = new Map<string, ReadonlyArray<any>>(structureEntries)

      const badges = new Array<Badge>()
      detailsMap.forEach((value, key) => badges.push({
        ...value,
        requirements: structureMap.get(key)![1].rows as ReadonlyArray<BadgeRequirement>
      } as Badge))

      return badges as ReadonlyArray<Badge>
    })
  }

  private buildGetBadgeStructureByTypeUrl(section: Section, term: Term, type_id: number) {
    return '/osm/ext/badges/records/?action=getBadgeStructureByType'
      + '&a=1'
      + '&type_id=' + type_id
      + '&section_id=' + section!.section_id
      + '&term_id=' + term!.term_id
      + '&section=' + section!.section_type;
  }
}
