import { Subject } from "./subject";

export interface SpecialSubjectGroup {
  id: number;
  name: string;
  code: string;
  subjects: Subject[];
}