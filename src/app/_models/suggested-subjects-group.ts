import { Major } from "./major";
import { SpecialSubjectGroup } from "./special-subject-group";
import { Subject } from "./subject";
import { TranscriptType } from "./transcript";

export interface SuggestedSubjectsGroup {
  id: number;
  name: string;
  totalMark: number;
  subjectDataSets: Subject[];
  specialSubjectGroups: SpecialSubjectGroup[];
  suggestedMajors: Major[];
}

export interface UserSuggestionSubjectGroup {
  transcriptTypeId: number;
  transcriptTypeName: string;
  provinceId: number;
  gender: number;
  subjectGroupDataSets: SuggestedSubjectsGroup[];
  transcriptDetails: TranscriptType[];
}