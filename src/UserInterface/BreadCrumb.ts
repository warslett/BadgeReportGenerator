export function breadcrumb(label: string, destination: string): Breadcrumb {
  return { label: label, destination: destination }
}
export default interface Breadcrumb {
  readonly label: string
  readonly destination: string
}
