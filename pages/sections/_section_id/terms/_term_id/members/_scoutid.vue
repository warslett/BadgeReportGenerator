<template>
  <div>
    <NavBar :heading="member.full_name" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-body">
              test
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
import {BadgeDetail} from "~/src/Model/BadgeDetail";
import {Member} from "~/src/Model/Member";
import {breadcrumb, Breadcrumb} from "~/src/UserInterface/BreadCrumb";
import {Context} from "~/src/Context";

export default Vue.extend({
  name: 'MemberPage',
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      term: {} as Term,
      member: {} as Member,
      details: {} as Map<string, BadgeDetail>
    }
  },
  computed: {
    breadcrumbs(): Array<Breadcrumb> {
      return [
        breadcrumb('Sections', '/'),
        breadcrumb(this.section.group_name + ': ' + this.section.section_name, '/sections/' + this.section.section_id),
        breadcrumb(this.term.name, '/sections/' + this.section.section_id + '/terms/' + this.term.term_id)
      ]
    },
  },
  async asyncData({ $auth, params, error, $axios, $members }: Context) {
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

    const badgeStructureResponse = await $axios.get('/osm/ext/badges/records/?action=getBadgeStructureByType'
      + '&a=1'
      + '&type_id=1'
      + '&section_id=' + section!.section_id
      + '&term_id=' + term!.term_id
      + '&section=' + section!.section_type)

    const details = badgeStructureResponse.data.details as Map<string, BadgeDetail>

    return {
      user: user,
      section: section as Section,
      term: term as Term,
      details: details,
      member: member
    }
  }
})
</script>
