<template>
  <div>
    <NavBar :heading="term.name" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-body">
              <div class="table-responsive p-0">
                <table class="table align-items-center justify-content-center mb-0">
                  <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Full Name</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Age</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Patrol</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Actions</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="member in members">
                    <td>
                      <a href="javascript:void(0)" v-on:click="selectedMember = member" class="text-sm text-bolder text-secondary mb-0">
                        {{ member.full_name }}
                      </a>
                    </td>
                    <td>
                      {{ member.age }}
                    </td>
                    <td>
                      {{ member.patrol }}
                    </td>
                    <td>
                      <NuxtLink :to="'/sections/' + section.section_id + '/terms/' + term.term_id + '/members/' + member.scoutid" class="text-sm text-bolder text-secondary mb-0">
                        View Badges
                      </NuxtLink>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasSelectedMember" class="col-4">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3 mb-0">{{ selectedMember.full_name }}</h5>
              </div>
            </div>
            <div class="card-body">
              <dl class="row">
                <dt class="col-sm-3">First Name</dt>
                <dd class="col-sm-9">{{ selectedMember.firstname }}</dd>

                <dt class="col-sm-3">Last Name</dt>
                <dd class="col-sm-9">{{ selectedMember.lastname }}</dd>

                <dt class="col-sm-3">Age</dt>
                <dd class="col-sm-9">{{ selectedMember.age }}</dd>

                <dt class="col-sm-3">Patrol</dt>
                <dd class="col-sm-9">{{ selectedMember.patrol }}</dd>
              </dl>
              <NuxtLink :to="'/sections/' + section.section_id + '/terms/' + term.term_id + '/members/' + selectedMember.scoutid" class="btn btn-primary">View Badges</NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {User} from "~/src/Model/User";
import {Section} from "~/src/Model/Section";
import {Term} from "~/src/Model/Term";
import {Member} from "~/src/Model/Member";
import {Breadcrumb, breadcrumb} from "~/src/UserInterface/BreadCrumb";
import NavBar from "~/components/NavBar.vue";
import {Context} from "~/src/Context";

export default Vue.extend({
  name: 'TermPage',
  components: {NavBar},
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      term: {} as Term,
      members: [] as Array<Member>,
      selectedMember: null as Member|null
    }
  },
  async asyncData({ params, $auth, error, $members }: Context) {
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

    const members = await $members.findMembers(section, term)

    return {
      user: user,
      section: section as Section,
      term: term as Term,
      members: members
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
    hasSelectedMember(): boolean {
      return this.selectedMember != null
    }
  }
})
</script>
