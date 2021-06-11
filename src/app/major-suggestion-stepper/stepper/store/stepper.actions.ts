import { Action } from "@ngrx/store";
import { ClassifiedTests } from "src/app/_models/classified-tests";
import { Major } from "src/app/_models/major";
import { Mark } from "src/app/_models/mark";
import { Province } from "src/app/_models/province";
import { SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from "src/app/_models/suggested-subjects-group";
import { Test } from "src/app/_models/test";
import { TestSubmission } from "src/app/_models/test-submission";
import { MockTestBasedUniversity, TrainingProgramBasedUniversity } from "src/app/_models/university";
import { TestSubmissionParam } from "src/app/_params/question-param";
import { Subject } from "../../../_models/subject";

export const LOAD_SUBJECTS = '[Stepper] Load Subjects';
export const SET_SUBJECTS = '[Stepper] Set Subjects';
export const SET_MARKS = '[Stepper] Set Marks';
export const SET_SUGGESTED_SUBJECTS_GROUP = '[Stepper] Set Suggested Subjects Group';
export const SET_UNIVERSIIES = '[Stepper] Set Universities';
export const LOAD_UNIVERSIIES = '[Stepper] Load Universities';
export const RELOAD_UNIVERSIIES = '[Stepper] Reload Universities';
export const SET_TESTS = '[Stepper] Set Tests';
export const LOAD_TESTS = '[Stepper] Load Tests';
export const LOAD_TEST = '[Stepper] Load Test';
export const SET_TEST = '[Stepper] Set Test';
export const REFRESH_TEST = '[Stepper] Refresh Test';
export const SCORING_TEST = '[Stepper] Scoring Test';
export const SET_TEST_MARK = '[Stepper] Set Test Mark';
export const SAVE_UNSAVE_TEST_SUBMISSIONS = '[Stepper] Save Unsave Test Submissions';
export const SAVE_UNSAVE_TEST_SUBMISSIONS_SUCCESS = '[Stepper] Save Test Submissions Success';
export const CARING_ACTION = '[Stepper] Caring Action';
export const CARING_ACTION_SUCCESS = '[Stepper] Caring Action Success';
export const CARING_ACTION_UNSUCCESS = '[Stepper] Caring Action Unsuccess';
export const UNCARING_ACTION = '[Stepper] Uncaring Action';
export const UNCARING_ACTION_SUCCESS = '[Stepper] Uncaring Action Success';
export const UNCARING_ACTION_UNSUCCESS = '[Stepper] Uncaring Action Unuccess';
export const LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS = '[Stepper] Load Universities After Doing Mock Tests';
export const SET_UNIVERSIIES_AFTER_DOING_MOCK_TESTS = '[Stepper] Set Universities After Doing Mock Tests';
export const LOAD_USER_SUGGESTION = '[Stepper] Load User Suggestion';
export const SET_USER_SUGGESTION = '[Stepper] Set User Suggestion';
export const LOAD_PROVINCES = '[Stepper] Load Provinces';
export const SET_PROVINCES = '[Stepper] Set Provinces';
export const RESET_STATE = '[Stepper] Reset State';
export const HAS_ERRORS = '[Stepper] Has Errors';
export const CONFIRM_ERRORS = '[Stepper] Confirm Errors';

export class LoadSubjects implements Action {
  readonly type = LOAD_SUBJECTS;
}

export class SetSubjects implements Action {
  readonly type = SET_SUBJECTS;
  constructor(public payload: Subject[]) {}
}

export class SetMarks implements Action {
  readonly type = SET_MARKS;
  constructor(public payload: {marks: Mark[], transcriptTypeId: number, gender: number, provinceId: number}) {}
}

export class SetSuggestedSubjectsGroup implements Action {
  readonly type = SET_SUGGESTED_SUBJECTS_GROUP;
  constructor(public payload: SuggestedSubjectsGroup[]) {}
}

export class LoadUniversities implements Action {
  readonly type = LOAD_UNIVERSIIES;
  constructor(public payload: {subjectGroup: SuggestedSubjectsGroup, major: Major, gender: number, provinceId: number}) {}
}

export class ReloadUniversities implements Action {
  readonly type = RELOAD_UNIVERSIIES;
}

export class SetUniversities implements Action {
  readonly type = SET_UNIVERSIIES;
  constructor(public payload: TrainingProgramBasedUniversity[]) {}
}

export class SetTests implements Action {
  readonly type = SET_TESTS;
  constructor(public payload: ClassifiedTests[]) {}
}

export class LoadTests implements Action {
  readonly type = LOAD_TESTS;
}


export class LoadTest implements Action {
  readonly type = LOAD_TEST;
  constructor(public payload: number) {}
}

export class SetTest implements Action {
  readonly type = SET_TEST;
  constructor(public payload: Test) {}
}

export class RefreshTest implements Action {
  readonly type = REFRESH_TEST;
}

export class ScoringTest implements Action {
  readonly type = SCORING_TEST;
  constructor(public payload: TestSubmissionParam) {}
}

export class SetTestMark implements Action {
  readonly type = SET_TEST_MARK;
  constructor(public payload: TestSubmission) {}
}

export class SaveUnsaveTestSubmissions implements Action {
  readonly type = SAVE_UNSAVE_TEST_SUBMISSIONS;
}

export class SaveUnsaveTestSubmissionsSuccess implements Action {
  readonly type = SAVE_UNSAVE_TEST_SUBMISSIONS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class CaringAction implements Action {
  readonly type = CARING_ACTION;
  constructor(public payload: {trainingProgramId: number, universityId: number, followTranscriptTypeId: number}) {}
}

export class CaringActionSuccess implements Action {
  readonly type = CARING_ACTION_SUCCESS;
}

export class UncaringAction implements Action {
  readonly type = UNCARING_ACTION;
  constructor(public payload: number) {}
}

export class UncaringActionSuccess implements Action {
  readonly type = UNCARING_ACTION_SUCCESS;
}

export class LoadAfterMockTestsUniversities implements Action {
  readonly type = LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS;
}

export class SetAfterMockTestsUniversities implements Action {
  readonly type = SET_UNIVERSIIES_AFTER_DOING_MOCK_TESTS;
  constructor(public payload: MockTestBasedUniversity) {}
}

export class LoadUserSuggestion implements Action {
  readonly type = LOAD_USER_SUGGESTION;
}

export class SetUserSuggestion implements Action {
  readonly type = SET_USER_SUGGESTION;
  constructor(public payload: UserSuggestionSubjectGroup) {}
}

export class LoadProvinces implements Action {
  readonly type = LOAD_PROVINCES;
}

export class SetProvinces implements Action {
  readonly type = SET_PROVINCES;
  constructor(public payload: Province[]) {}
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export type StepperActions = ResetState | ScoringTest | SetTestMark | LoadTest | SetTest | LoadSubjects |
            SetSubjects | SetMarks | SetSuggestedSubjectsGroup | LoadUniversities | ReloadUniversities | SetUniversities |
            LoadTests | SetTests | SaveUnsaveTestSubmissions | SaveUnsaveTestSubmissionsSuccess | RefreshTest | CaringAction |
            CaringActionSuccess | UncaringAction | UncaringActionSuccess | LoadAfterMockTestsUniversities | SetAfterMockTestsUniversities |
            LoadUserSuggestion | SetUserSuggestion | LoadProvinces | SetProvinces | HasErrors | ConfirmErrors;