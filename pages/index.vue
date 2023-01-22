<template>
  <div>
    <NavBar heading="Sections" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-md-8">
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
                  <tr v-for="section in user.sections">
                    <td>
                      <a href="javascript:void(0)" v-on:click="selectSection(section.section_id)" class="text-sm text-bolder text-secondary mb-0">
                        {{ section.group_name }}: {{ section.section_name }}
                      </a>
                    </td>
                    <td>
                      <NuxtLink :to="'/sections/' + section.section_id" class="text-sm text-bolder text-secondary mb-0">
                        View Terms ({{ section.terms.length }})
                      </NuxtLink>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasSelectedSection" class="col-4">
          <div class="card mb-4">
            <div class="card-header pb-0">
              <div class="float-start">
                <h5 class="mt-3 mb-0">{{ selectedSection.group_name }}: {{ selectedSection.section_name }}</h5>
              </div>
            </div>
            <div class="card-body">
              <dl class="row">
                <dt class="col-sm-3">Section</dt>
                <dd class="col-sm-9">{{ selectedSection.section_name }}</dd>

                <dt class="col-sm-3">Type</dt>
                <dd class="col-sm-9">{{ selectedSection.section_type }}</dd>

                <dt class="col-sm-3">Group</dt>
                <dd class="col-sm-9">{{ selectedSection.group_name }}</dd>

                <dt class="col-sm-3">Terms</dt>
                <dd class="col-sm-9">{{ selectedSection.terms.length }}</dd>

                <dt class="col-sm-3">Id</dt>
                <dd class="col-sm-9">{{ selectedSection.section_id }}</dd>
              </dl>
              <NuxtLink :to="'/sections/' + selectedSection.section_id" class="btn btn-primary">View Terms</NuxtLink>
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
import {breadcrumb} from "~/src/UserInterface/BreadCrumb";
import NavBar from "~/components/NavBar.vue";
import {Section} from "~/src/Model/Section";

export default Vue.extend({
  name: 'IndexPage',
  components: {NavBar},
  data() {
    return {
      selectedSection: null as Section|null,
      breadcrumbs: [breadcrumb('Sections', '/' )]
    }
  },
  computed : {
    user(): User {
      if (null === this.$auth.user) {
        this.$auth.fetchUser()
      }

      return this.$auth.user!.data as User
    },
    hasSelectedSection(): boolean {
      return this.selectedSection != null
    }
  },
  methods: {
    selectSection: function (section_id: number): void {
      const foundSection: Section|undefined = this.user.sections.find(item => item.section_id == section_id)
      if (foundSection == undefined) {
        throw new Error("Could not find section with id " + section_id)
      }
      this.selectedSection = foundSection as Section
    }
  }
})
</script>
