import {Term} from "~/src/Model/Term";

export interface Section {
  readonly section_name: string
  readonly group_name: string
  readonly section_id: number
  readonly section_type: string
  readonly terms: ReadonlyArray<Term>
}
