<template>
  <div>
    <NavBar :heading="term.name" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col">
          <div class="card mb-4">
            <div class="card-body">
              <div class="table-responsive p-0">
                <table class="table align-items-center justify-content-center mb-0">
                  <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Section Name</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Actions</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="member in members">
                    <td>
                      {{ member.full_name }}
                    </td>
                    <td>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
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
import {Auth} from "@nuxtjs/auth-next";
import {NuxtAxiosInstance} from "@nuxtjs/axios";

export default Vue.extend({
  name: 'TermPage',
  components: {NavBar},
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      term: {} as Term,
      members: [] as Array<Member>
    }
  },
  async asyncData({ params, $auth, error, $axios }) {
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

    const response = await $axios.get('/osm/ext/members/contact/?action=getListOfMembers&sort=dob'
      + '&sectionid=' + section!.section_id
      + '&termid=' + term!.term_id
      + '&section=' + section!.section_type)

    return {
      user: user,
      section: section as Section,
      term: term as Term,
      members: response.data.items as Array<Member>
    }
  },
  computed: {
    breadcrumbs(): Array<Breadcrumb> {
      return [
        breadcrumb('Sections', '/'),
        breadcrumb(this.section.group_name + ': ' + this.section.section_name, '/sections/' + this.section.section_id),
        breadcrumb(this.term.name, '/sections/' + this.section.section_id + '/terms/' + this.term.term_id)
      ]
    }
  }
})
</script>
