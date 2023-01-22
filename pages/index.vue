<template>
  <div>
    <NavBar heading="Sections" />
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
                  <tr v-for="section in user.sections">
                    <td>
                      <NuxtLink :to="'/sections/' + section.section_id" class="text-sm text-bolder text-secondary mb-0">
                        {{ section.group_name }}: {{ section.section_name }}
                      </NuxtLink>
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

export default Vue.extend({
  name: 'IndexPage',
  components: {NavBar},
  data() {
    return {
      breadcrumbs: [breadcrumb('Sections', '/' )]
    }
  },
  computed : {
    user(): User {
      if (null === this.$auth.user) {
        this.$auth.fetchUser()
      }

      return this.$auth.user!.data as User
    }
  }
})
</script>
