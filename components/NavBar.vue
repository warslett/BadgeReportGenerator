<template>
  <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl " id="navbarBlur" data-scroll="false">
    <div class="container-fluid py-1 px-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
          <li v-for="breadcrumb in breadcrumbs" class="breadcrumb-item text-sm text-white">
            <NuxtLink class="opacity-5 text-white" :to="breadcrumb.destination">{{ breadcrumb.label }}</NuxtLink>
          </li>
        </ol>
        <h6 class="font-weight-bolder text-white mb-0">{{ heading }}</h6>
      </nav>
      <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
          <div class="text-white">
            {{ username }} <a href="javascript:void(0)" class="text-white text-xs" @click="$emit('logout')">Log out</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ['heading', 'breadcrumbs', 'username']
})
</script>
