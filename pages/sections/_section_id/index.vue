<template>
  <div>
    <NavBar :heading="section.group_name + ': ' + section.section_name" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-md-8">
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
                      <a href="javascript:void(0)" v-on:click="selectedTerm = term" class="text-sm text-bolder text-secondary mb-0">
                        {{ term.name }}
                      </a>
                    </td>
                    <td>
                      <NuxtLink :to="'/sections/' + section.section_id + '/terms/' + term.term_id" class="text-sm text-bolder text-secondary mb-0">
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
        <div v-if="hasSelectedTerm" class="col-4">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3 mb-0">{{ selectedTerm.name }}</h5>
              </div>
            </div>
            <div class="card-body">
              <dl class="row">
                <dt class="col-sm-3">Name</dt>
                <dd class="col-sm-9">{{ selectedTerm.name }}</dd>
                <dt class="col-sm-3">Start Date</dt>
                <dd class="col-sm-9">{{ localeDate(selectedTerm.startdate) }}</dd>
                <dt class="col-sm-3">End Date</dt>
                <dd class="col-sm-9">{{ localeDate(selectedTerm.enddate) }}</dd>
                <dt class="col-sm-3">Id</dt>
                <dd class="col-sm-9">{{ selectedTerm.term_id }}</dd>
              </dl>
              <NuxtLink :to="'/sections/' + section.section_id + '/terms/' + selectedTerm.term_id" class="btn btn-primary">View Members</NuxtLink>
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
import NavBar from "~/components/NavBar.vue";
import {Context} from "~/src/Context";

export default Vue.extend({
  name: 'SectionPage',
  components: {NavBar},
  data() {
    return {
      user: {} as User,
      section: {} as Section,
      terms: [] as Array<Term>,
      selectedTerm: null as Term|null
    }
  },
  async asyncData({ params, $auth, error }: Context) {
    if (null === $auth.user) {
      await $auth.fetchUser()
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
    },
    hasSelectedTerm(): boolean {
      return this.selectedTerm != null
    }
  },
  methods: {
    localeDate(date_string: string): string {
      return new Date(date_string).toLocaleDateString()
    }
  }
})
</script>
