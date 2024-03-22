<template>
  <table class="table table-bordered align-items-center justify-content-center mb-0">
    <thead>
    <tr>
      <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2 w-4">Area</th>
      <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2 w-4">Requirement</th>
      <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2">Description</th>
      <th class="text-uppercase text-xxs font-weight-bolder opacity-7 px-2">Complete</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="requirement in badgeRecord.badge.requirements" :class="'module-' + requirement.module">
      <td class="text-sm align-text-top">
        {{ requirement.module.toUpperCase() }}
      </td>
      <td class="text-sm align-text-top">
        {{ requirement.name }}
      </td>
      <td class="text-sm text-wrap" v-html="nl2br(requirement.tooltip)"></td>
      <td :class="'text-sm text-wrap ' + badgeRecordRequirementClass(requirement)">
        {{ badgeRecordRequirement(requirement) }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {Badge} from "~/src/Model/Badge";
import {BadgeRecord} from "~/src/Model/BadgeRecord";
import {BadgeRequirement} from "~/src/Model/BadgeRequirement";

export default Vue.extend({
  name: "BadgeTable",
  props: {
    badgeRecord: { type: Object as PropType<BadgeRecord>, required: true },
  },
  methods: {
    badgeRecordRequirement(requirement: BadgeRequirement): string {
      const badgeRecordRequirement = this.badgeRecord.requirements.get(requirement.field)
      return badgeRecordRequirement == null ? 'Incomplete' : badgeRecordRequirement
    },
    badgeRecordRequirementIsComplete(requirement: BadgeRequirement): boolean {
      const requirements = this.badgeRecord.requirements
      return requirements.has(requirement.field) && requirements.get(requirement.field) != undefined
    },
    badgeRecordRequirementClass(requirement: BadgeRequirement): string {
      return this.badgeRecordRequirementIsComplete(requirement) ? 'text-white bg-success' : 'text-muted bg-white'
    },
    nl2br(text: string): string {
      return text.replaceAll("\n", "<br/>")
    }
  }
})
</script>

<style>
.module-a {
  background-color: #d6fddc;
}
.module-b {
  background-color: #e7d3f5;
}
.module-c {
  background-color: #fdf9d6;
}
.module-d {
  background-color: #dcf3fd;
}
.module-e {
  background-color: #fadcfd;
}
</style>
