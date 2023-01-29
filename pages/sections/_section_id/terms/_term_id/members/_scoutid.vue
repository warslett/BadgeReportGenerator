<template>
  <div>
    <NavBar :heading="member.full_name" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-4">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3 mb-0">Challenge Badges</h5>
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
                    <input type="checkbox" class="form-check" />
                  </td>
                  <td>
                    <a href="javascript:void(0)" v-on:click="selectedBadge = badge" class="text-sm text-bolder text-secondary mb-0">
                      {{ badge.name }}
                    </a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="hasSelectedBadge" class="col-md-8">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3">{{ selectedBadge.name }}</h5>
                <p class="text-sm mb-0">{{ selectedBadge.description }}</p>
              </div>
            </div>
            <div class="card-body">
              <table class="table table-bordered align-items-center justify-content-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2 w-4">Requirement</th>
                  <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2">Description</th>
                  <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2">Complete</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="requirement in selectedBadge.requirements" :class="'module-' + requirement.module">
                  <td class="text-sm align-text-top">
                    {{ requirement.name }}
                  </td>
                  <td class="text-sm text-wrap">
                    {{ requirement.tooltip }}
                  </td>
                  <td class="text-sm text-wrap bg-white">

                  </td>
                </tr>
                </tbody>
              </table>
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
import {Context} from "~/src/Context";
import {Badge} from "~/src/Model/Badge";

export default Vue.extend({
  name: 'MemberPage',
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      term: {} as Term,
      member: {} as Member,
      badges: {} as ReadonlyArray<Badge>,
      selectedBadge: null as Badge|null
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
    breadcrumbs(): Array<Breadcrumb> {
      return [
        breadcrumb('Sections', '/'),
        breadcrumb(this.section.group_name + ': ' + this.section.section_name, '/sections/' + this.section.section_id),
        breadcrumb(this.term.name, '/sections/' + this.section.section_id + '/terms/' + this.term.term_id),
        breadcrumb(this.member.full_name, '/sections/' + this.section.section_id + '/terms/' + this.term.term_id + '/members/' + this.member.scoutid)
      ]
    },
    hasSelectedBadge(): boolean {
      return this.selectedBadge != null
    }
  }
})
</script>

<style>
  .module-a {
    background-color: #d6fddc;
  }
  .module-b {
    background-color: #e7d3f5;
  }
  .module-c {
    background-color: #fdf9d6;
  }
  .module-d {
    background-color: #dcf3fd;
  }
  .module-e {
    background-color: #fadcfd;
  }
</style>
