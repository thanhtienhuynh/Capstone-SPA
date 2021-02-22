import { Action } from "@ngrx/store";
import { Mark } from "src/app/_models/mark";
import { SuggestedSubjectsGroup } from "src/app/_models/suggested-subjects-group";
import { Subject } from "../../../_models/subject";

export const LOAD_SUBJECTS = '[Stepper] Load Subjects';
export const SET_SUBJECTS = '[Stepper] Set Subjects';
export const SET_MARKS = '[Stepper] Set Marks';
export const SET_IS_SUGGEST = '[Stepper] Set Is Suggest';
export const SET_SUGGESTED_SUBJECTS_GROUP = '[Stepper] Set Suggested Subjects Group';

export class LoadSubjects implements Action {
  readonly type = LOAD_SUBJECTS;
}

export class SetSubjects implements Action {
  readonly type = SET_SUBJECTS;
  constructor(public payload: Subject[]) {}
}

export class SetMarks implements Action {
  readonly type = SET_MARKS;
  constructor(public payload: Mark[]) {}
}

export class SetIsSuggest implements Action {
  readonly type = SET_IS_SUGGEST;
  constructor(public payload: boolean) {}
}

export class SetSuggestedSubjectsGroup implements Action {
  readonly type = SET_SUGGESTED_SUBJECTS_GROUP;
  constructor(public payload: SuggestedSubjectsGroup[]) {}
}

export type StepperActions = LoadSubjects | SetSubjects | SetMarks | SetIsSuggest | SetSuggestedSubjectsGroup;