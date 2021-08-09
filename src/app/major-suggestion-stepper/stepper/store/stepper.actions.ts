import { Action } from "@ngrx/store";
import { ClassifiedTests } from "src/app/_models/classified-tests";
import { Major } from "src/app/_models/major";
import { Mark } from "src/app/_models/mark";
import { Province } from "src/app/_models/province";
import { CusSubjectGroup, SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from "src/app/_models/suggested-subjects-group";
import { Test } from "src/app/_models/test";
import { TestSubmission } from "src/app/_models/test-submission";
import { MockTestBasedUniversity, TrainingProgramBasedUniversity } from "src/app/_models/university";
import { MarkParam } from "src/app/_params/mark-param";
import { TestSubmissionParam } from "src/app/_params/question-param";
import { Subject } from "../../../_models/subject";

export const LOAD_SUBJECTS = '[Stepper] Load Subjects';
export const SET_SUBJECTS = '[Stepper] Set Subjects';
export const LOAD_SUBJECT_GROUPS = '[Stepper] Load Subject Groups';
export const SET_SUBJECT_GROUPS = '[Stepper] Set Subject Groups';
export const SET_MARKS = '[Stepper] Set Marks';
export const SAVE_MARKS = '[Stepper] Save Marks';
export const SET_SUGGESTED_SUBJECT_GROUPS = '[Stepper] Set Suggested Subjects Group';
export const SET_SELECTED_SUGGESTED_SUBJECTGROUP = '[Stepper] Set Selected Suggested Subject Group';
export const LOAD_MAJORS_SELECTED_SUBJECT_GROUP = '[Stepper] Load Majors Selected Subject Group';
export const SET_MAJORS_SELECTED_SUBJECT_GROUP = '[Stepper] Set Majors Selected Subject Group';
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
export const SET_TEST_SUBMISSION_ID = '[Stepper] Set Test Submission Id';
export const DONE_LOADING = '[Stepper] Done Loading';
export const RESET_STATE = '[Stepper] Reset State';
export const HAS_ERRORS = '[Stepper] Has Errors';
export const CONFIRM_ERRORS = '[Stepper] Confirm Errors';

export class LoadSubjectGroups implements Action {
  readonly type = LOAD_SUBJECT_GROUPS;
  readonly message = "Đang nạp danh sách tổ hợp môn";
}

export class SetSubjectGroups implements Action {
  readonly type = SET_SUBJECT_GROUPS;
  constructor(public payload: CusSubjectGroup[]) {}
}

export class LoadSubjects implements Action {
  readonly type = LOAD_SUBJECTS;
  readonly message = "Đang nạp danh sách các môn học";
}

export class SetSubjects implements Action {
  readonly type = SET_SUBJECTS;
  constructor(public payload: Subject[]) {}
}

export class SetMarks implements Action {
  readonly type = SET_MARKS;
  readonly message = "Đang tính toán kết quả gợi ý";
  constructor(public payload:  MarkParam, public shouldSave: boolean) {}
}

export class SaveMarks implements Action {
  readonly type = SAVE_MARKS;
  readonly message = "Đang lưu điểm";
}

export class SetSuggestedSubjectsGroup implements Action {
  readonly type = SET_SUGGESTED_SUBJECT_GROUPS;
  constructor(public payload: SuggestedSubjectsGroup[]) {}
}

export class SetSelectedSuggestedSubjectgroup implements Action {
  readonly type = SET_SELECTED_SUGGESTED_SUBJECTGROUP;
  constructor(public payload: SuggestedSubjectsGroup) {}
}

export class LoadMajorsSelectedSubjectGroup implements Action {
  readonly type = LOAD_MAJORS_SELECTED_SUBJECT_GROUP;
  readonly message = "Đang tính toán kết quả gợi ý";
}

export class SetMajorsSelectedSubjectGroup implements Action {
  readonly type = SET_MAJORS_SELECTED_SUBJECT_GROUP;
  constructor(public payload: SuggestedSubjectsGroup[]) {}
}

export class LoadUniversities implements Action {
  readonly type = LOAD_UNIVERSIIES;
  readonly message = "Đang tìm các trường đại học phù hợp";
  constructor(public payload: {subjectGroup: SuggestedSubjectsGroup, major: Major}) {}
}

export class ReloadUniversities implements Action {
  readonly type = RELOAD_UNIVERSIIES;
  readonly message = "Đang nạp lại danh sách các trường đại học";
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
  readonly message = "Đang nạp danh sách các bài thi thử";
}


export class LoadTest implements Action {
  readonly type = LOAD_TEST;
  readonly message = "Đang nạp bài thi";
  constructor(public payload: number) {}
}

export class SetTest implements Action {
  readonly type = SET_TEST;
  readonly message = "Đang cấu hình bài thi";
  constructor(public payload: Test) {}
}

export class RefreshTest implements Action {
  readonly type = REFRESH_TEST;
}

export class ScoringTest implements Action {
  readonly type = SCORING_TEST;
  readonly message = "Đang chấm điểm";
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
  readonly message = "Đang theo dõi";
  constructor(public payload: {trainingProgramId: number, universityId: number, followTranscriptTypeId: number, position: number}) {}
}

export class CaringActionSuccess implements Action {
  readonly type = CARING_ACTION_SUCCESS;
}

export class UncaringAction implements Action {
  readonly type = UNCARING_ACTION;
  readonly message = "Đang bỏ theo dõi";
  constructor(public payload: number) {}
}

export class UncaringActionSuccess implements Action {
  readonly type = UNCARING_ACTION_SUCCESS;
}

export class LoadAfterMockTestsUniversities implements Action {
  readonly message = "Đang tính toán lại danh sách các trường đại học";
  readonly type = LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS;
}

export class SetAfterMockTestsUniversities implements Action {
  readonly type = SET_UNIVERSIIES_AFTER_DOING_MOCK_TESTS;
  constructor(public payload: MockTestBasedUniversity) {}
}

export class LoadUserSuggestion implements Action {
  readonly message = "Đang tìm lại kết quả gợi ý trước đó";
  readonly type = LOAD_USER_SUGGESTION;
}

export class SetUserSuggestion implements Action {
  readonly type = SET_USER_SUGGESTION;
  constructor(public payload: UserSuggestionSubjectGroup) {}
}

export class LoadProvinces implements Action {
  readonly type = LOAD_PROVINCES;
  readonly message = "Đang nạp danh sách tỉnh thành";
}

export class SetProvinces implements Action {
  readonly type = SET_PROVINCES;
  constructor(public payload: Province[]) {}
}

export class SetTestSubmissionId implements Action {
  readonly type = SET_TEST_SUBMISSION_ID;
  constructor(public payload: number) {}
}

export class DoneLoading implements Action {
  readonly type = DONE_LOADING;
  constructor(public payload: string) {}
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: {action: string, messages: string[]}) {}
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
            LoadUserSuggestion | SetUserSuggestion | LoadProvinces | SetProvinces | HasErrors | ConfirmErrors |
            DoneLoading | SaveMarks | SetTestSubmissionId | LoadSubjectGroups | SetSubjectGroups | SetSelectedSuggestedSubjectgroup |
            LoadMajorsSelectedSubjectGroup | SetMajorsSelectedSubjectGroup;