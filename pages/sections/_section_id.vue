<template>
  <div>
    <NavBar :heading="section.group_name + ': ' + section.section_name" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col">
          <div class="card mb-4">
            <div class="card-body">
              <div class="table-responsive p-0">
                <table class="table align-items-center justify-content-center mb-0">
                  <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Term Name</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">Actions</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="term in terms" :key="term.term_id">
                    <td>
                      <NuxtLink :to="'/terms/' + term.term_id" class="text-sm text-bolder text-secondary mb-0">
                        {{ term.name }}
                      </NuxtLink>
                    </td>
                    <td>
                      <NuxtLink :to="'/terms/' + term.term_id" class="text-sm text-bolder text-secondary mb-0">
                        View Members
                      </NuxtLink>
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
import {Section} from "~/src/Model/Section";
import {User} from "~/src/Model/User";
import {Term} from "~/src/Model/Term";
import {Breadcrumb, breadcrumb} from "~/src/UserInterface/BreadCrumb";

export default Vue.extend({
  name: 'SectionPage',
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      terms: [] as Array<Term>
    }
  },
  async asyncData({ params, $auth, error }) {
    if (null === $auth.user) {
      $auth.fetchUser()
    }

    const user = $auth.user!.data as User
    const section: Section|undefined = user.sections.find(item => item.section_id == parseInt(params['section_id']))

    if (section == undefined) {
      error({ statusCode: 404, message: 'Section not found' })
    }

    const terms = section!.terms.slice();
    terms.reverse();

    return {
      user: user,
      section: section as Section,
      terms: terms
    }
  },
  computed: {
    breadcrumbs(): Array<Breadcrumb> {
      return [
        breadcrumb('Sections', '/'),
        breadcrumb(this.section.group_name + ': ' + this.section.section_name, '/sections/' + this.section.section_id)
      ]
    }
  }
})
</script>
