import { Major } from "./major";
import { SpecialSubjectGroup } from "./special-subject-group";
import { Subject } from "./subject";
import { TranscriptType } from "./transcript";

export interface SuggestedSubjectsGroup {
  id: number;
  name: string;
  totalMark: number;
  top: number;
  subjectDataSets: Subject[];
  specialSubjectGroups: SpecialSubjectGroup[];
  suggestedMajors: Major[];
}

export interface UserSuggestionSubjectGroup {
  provinceId: number;
  gender: number;
  transcriptDetails: TranscriptType[];
}

export interface CusSubjectGroup {
  id: number;
  groupCode: string;
}