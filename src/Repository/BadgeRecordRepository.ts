import {Member} from "~/src/Model/Member";
import {Section} from "~/src/Model/Section";
import {Term} from "~/src/Model/Term";
import {BadgeRecord} from "~/src/Model/BadgeRecord";
import {Badge} from "~/src/Model/Badge";
import {Cache} from "~/src/Cache/Cache";
import {NuxtAxiosInstance} from "@nuxtjs/axios";

export class BadgeRecordRepository {
  private readonly responseCache: Cache<string, any>
  private readonly axios: NuxtAxiosInstance
  private readonly badgeRecordCache: Cache<string, BadgeRecord>;

  constructor(responseCache: Cache<string, any>, axios: NuxtAxiosInstance, badgeRecordCache: Cache<string, BadgeRecord>) {
    this.responseCache = responseCache
    this.axios = axios
    this.badgeRecordCache = badgeRecordCache;
  }

  async findBadgeRecordForMember(member: Member, section: Section, term: Term, badge: Badge): Promise<BadgeRecord> {
    const badgeRecordCacheRecord = member.scoutid + ':' + section.section_id + ':' + term.term_id + ':' + badge.badge_id
    return await this.badgeRecordCache.resolveAsync(badgeRecordCacheRecord, async () => {
      const url = this.buildGetBadgeRecordsUrl(term, section, badge)
      const response = await this.responseCache.resolveAsync(url, async () => this.axios.get(url))

      type ResponseItem = { scoutid: number, awarded: string, completed: string }
      const responseItems = response.data.items as ResponseItem[]

      const foundMemberItem: ResponseItem|undefined = responseItems.find(item => item.scoutid == member.scoutid)
      if (foundMemberItem == undefined) {
        throw new Error('Could not find badge record for ' + member.scoutid)
      }
      const memberItem = foundMemberItem as ResponseItem

      const memberItemMap = new Map<string, any>(Object.entries(memberItem))
      const requirements = new Map<number, string>()

      badge.requirements.forEach(requirement => requirements.set(requirement.field, memberItemMap.get('_' + requirement.field)))
      return new BadgeRecord(foundMemberItem.completed == '1', foundMemberItem.awarded == '1', requirements)
    })
  }

  private buildGetBadgeRecordsUrl(term: Term, section: Section, badge: Badge) {
    return '/osm/ext/badges/records/?action=getBadgeRecords'
      + '&term_id=' + term.term_id
      + '&section=' + section.section_type
      + '&badge_id=' + badge.badge_id
      + '&section_id=' + section.section_id
      + '&badge_version=' + badge.badge_version
      + '&underscores';
  }
}
