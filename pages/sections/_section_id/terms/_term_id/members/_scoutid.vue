<template>
  <div>
    <NavBar :heading="member.full_name" />
    <div class="container-fluid py-4 py-print-0">
      <div class="row">
        <div class="col-4 no-print">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3 mb-0">Challenge Badges</h5>
              </div>
              <div class="float-end no-print" v-if="checkedBadges.length > 0">
                <button class="btn btn-primary mb-0" @click="generateBadgeRecords">Generate Report</button>
              </div>
            </div>
            <div class="card-body">
              <table class="table align-items-center justify-content-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2 w-4">
                    <input type="checkbox" class="form-check" />
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Badge Name</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="badge in badges">
                  <td>
                    <input type="checkbox" class="form-check" :value="badge" v-model="checkedBadges" />
                  </td>
                  <td>
                    <a href="javascript:void(0)" v-on:click="toggleBadge(badge)" class="text-sm text-bolder text-secondary mb-0">
                      {{ badge.name }}
                    </a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="badgeRecords.length !== 0" class="col-8 col-print-12">
          <div class="no-print mb-3 d-flex">
            <button class="btn btn-white mb-0 ml-auto" @click="printReport">Print</button>
          </div>
          <div class="card mb-4 page" v-for="badgeRecord in badgeRecords">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3 mt-print-0 ">{{ badgeRecord.badge.name }}</h5>
                <p class="text-sm mb-0">{{ badgeRecord.badge.description }}</p>
              </div>
            </div>
            <div class="card-body">
              <BadgeTable :badge-record="badgeRecord" />
            </div>
          </div>
        </div>
        <div v-if="isLoadingBadge" class="col-8">
          <div class="card">
            <div class="card-body">
              Loading...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {User} from "~/src/Model/User";
import {Section} from "~/src/Model/Section";
import {Term} from "~/src/Model/Term";
import {Member} from "~/src/Model/Member";
import {breadcrumb, Breadcrumb} from "~/src/UserInterface/BreadCrumb";
import {Badge} from "~/src/Model/Badge";
import {BadgeRecord} from "~/src/Model/BadgeRecord";
import {Context} from "@nuxt/types";
import BadgeTable from "~/components/BadgeTable.vue";

export default Vue.extend({
  name: 'MemberPage',
  components: {BadgeTable},
  head() {
    const member = this.member as Member
    return {
      title: "Badge Report - " + member.full_name
    };
  },
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      term: {} as Term,
      member: {} as Member,
      badges: {} as ReadonlyArray<Badge>,
      checkedBadges: [] as Badge[],
      badgeRecords: [] as BadgeRecord[],
      isLoadingBadge: false
    }
  },
  async asyncData({ $auth, params, error, $members, $badges }: Context) {
    if (null === $auth.user) {
      await $auth.fetchUser()
    }

    const user = $auth.user!.data as User

    const foundSection: Section|undefined = user.sections.find(item => item.section_id == parseInt(params['section_id']))
    if (foundSection == undefined) {
      error({ statusCode: 404, message: 'Section not found' })
    }
    const section = foundSection as Section

    const foundTerm: Term|undefined = section.terms.find(item => item.term_id == parseInt(params['term_id']))
    if (foundTerm == undefined) {
      error({ statusCode: 404, message: 'Term not found' })
    }
    const term = foundTerm as Term

    const foundMember = await $members.findMember(section, term, parseInt(params['scoutid']))
    if (foundMember == undefined) {
      error({ statusCode: 404, message: 'Member not found' })
    }
    const member = foundMember as Member

    const badges = await $badges.findBadgesByType(section, term, 1)

    return {
      user: user,
      section: section as Section,
      term: term as Term,
      member: member,
      badges: badges
    }
  },
  computed: {
    BadgeRecord() {
      return BadgeRecord
    },
    breadcrumbs(): Array<Breadcrumb> {
      return [
        breadcrumb('Sections', '/'),
        breadcrumb(this.section.group_name + ': ' + this.section.section_name, '/sections/' + this.section.section_id),
        breadcrumb(this.term.name, '/sections/' + this.section.section_id + '/terms/' + this.term.term_id),
        breadcrumb(this.member.full_name, '/sections/' + this.section.section_id + '/terms/' + this.term.term_id + '/members/' + this.member.scoutid)
      ]
    },
  },
  methods: {
    toggleBadge(badge: Badge) {
      const indexOfBadge = this.checkedBadges.indexOf(badge)
      if (indexOfBadge === -1) {
        this.checkedBadges.push(badge)
      } else {
        this.checkedBadges.splice(indexOfBadge, 1)
      }
    },
    async generateBadgeRecords() {
      this.isLoadingBadge = true
      const badgeRecordPromises = [] as Promise<BadgeRecord>[]
      this.checkedBadges.forEach(badge => badgeRecordPromises.push(this.$badgeRecords.findBadgeRecordForMember(this.member, this.section, this.term, badge)))
      this.badgeRecords = await Promise.all(badgeRecordPromises)
      this.isLoadingBadge = false
    },
    printReport() {
      window.print()
    }
  }
})
</script>
