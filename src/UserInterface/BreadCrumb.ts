import Vue from "vue";

export function breadcrumb(label: string, destination: string): Breadcrumb {
  return { label: label, destination: destination }
}
export interface Breadcrumb {
  readonly label: string
  readonly destination: string
}

export interface BreadcrumbsPage extends Vue {
  breadcrumbs: Array<Breadcrumb>
}
