<template>
  <div>
    <NavBar :heading="term.name" :breadcrumbs="breadcrumbs" :username="user.full_name" @logout="$auth.logout()" />
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

export default Vue.extend({
  name: 'TermPage',
  async asyncData({ params, $auth, error, $axios }): Promise<{ user: User, section: Section, term: Term, members: Array<Member>, breadcrumbs: Array<object> }> {
    if (null === $auth.user) {
      $auth.fetchUser()
    }

    const user = $auth.user!.data as User
    const termId = parseInt(params['term_id'])
    let foundSection = undefined as Section|undefined
    let foundTerm = undefined as Term|undefined

    // Find section and term for page
    for(let x = 0; x < user.sections.length && foundSection == undefined; x++) {
      let currentSection = user.sections[x]
      for (let y = 0; y < currentSection.terms.length && foundTerm == undefined; y++) {
        let currentTerm = currentSection.terms[y];
        if (currentTerm.term_id == termId) {
          foundSection = currentSection
          foundTerm = currentTerm
        }
      }
    }

    if (foundTerm == undefined || foundSection == undefined) {
      error({ statusCode: 404, message: 'Term not found' })
    }

    const response = await $axios.get('/osm/ext/members/contact/?action=getListOfMembers&sort=dob'
      + '&sectionid=' + foundSection!.section_id
      + '&termid=' + foundTerm!.term_id
      + '&section=' + foundSection!.section_type)

    return {
      user: user,
      section: foundSection as Section,
      term: foundTerm as Term,
      members: response.data.items as Array<Member>,
      breadcrumbs: [
        { 'label': 'Sections', 'destination': '/' },
        { 'label': foundSection!.group_name + ': ' + foundSection!.section_name, 'destination': '/sections/' + foundSection!.section_id },
        { 'label': foundTerm!.name, 'destination': '/terms/' + foundTerm!.term_id }
      ]
    }
  },
})
</script>
