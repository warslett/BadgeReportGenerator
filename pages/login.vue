<template>
  <div>
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto">
              <div class="card card-plain">
                <div class="card-header pb-0 text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Click the link below to log in to OSM.</p>
                </div>
                <div class="card-body">
                  <button class="btn btn-primary" @click="login">Log In</button>
                </div>
              </div>
            </div>
            <div class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column">
              <div class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden" style="background-image: url('/assets/img/cub-scout-in-new-clothing.jpg'); background-size: cover;">
                <span class="mask bg-gradient-primary opacity-5"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">Bade Report Generator</h4>
                <p class="text-white position-relative">Generate badge reports for your scouts from OSM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginPage',
  layout: 'login',
  methods: {
    login: async function () {
      await this.$auth.loginWith('social')
    }
  }
})
</script>
