import {Section} from "~/src/Model/Section";

export interface User {
  readonly full_name: string
  readonly sections: ReadonlyArray<Section>
}
