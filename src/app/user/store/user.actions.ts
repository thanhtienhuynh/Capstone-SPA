import { Action } from "@ngrx/store";
import { MajorBasedUserMajorDetail } from "src/app/_models/major-based-user-major-detail";
import { SelectedUserMajorDetail } from "src/app/_models/selected-user-major-detail";
import { UniversityBasedUserMajorDetail } from "src/app/_models/university-based-user-major-detail";
import { UserDetailTestSubmission, UserTestSubmission } from "src/app/_models/user-test-submission";

export const LOAD_SUBMISSIONS = '[User] Load Submissions';
export const SET_SUBMISSIONS = '[User] Set Submissions';
export const LOAD_DETAIL_SUBMISSION = '[User] Load Detail Submission';
export const SET_DETAIL_SUBMISSION = '[User] Set Question Submission';
export const LOAD_MAJOR_BASED_USER_MAJOR_DETAILS = '[User] Load Major Based User Major Details';
export const SET_MAJOR_BASED_USER_MAJOR_DETAILS = '[User] Set Major Based User Major Details';
export const LOAD_UNIVERSITY_BASED_USER_MAJOR_DETAILS = '[User] Load University Based User Major Details';
export const SET_UNIVERSITY_BASED_USER_MAJOR_DETAILS = '[User] Set University Based User Major Details';
export const SET_DETAIL_USER_MAJOR_DETAIL = '[User] Set Detail User Major Details';
export const HAS_ERRORS = '[User] Has Errors';
export const CONFIRM_ERRORS = '[User] Confirm Errors';

export class LoadSubmissions implements Action {
  readonly type = LOAD_SUBMISSIONS;
}

export class SetSubmissions implements Action {
  readonly type = SET_SUBMISSIONS;
  constructor(public payload: UserTestSubmission[]) {}
}

export class LoadDetailSubmission implements Action {
  readonly type = LOAD_DETAIL_SUBMISSION;
  constructor(public payload: number) {}
}

export class SetDetailSubmission implements Action {
  readonly type = SET_DETAIL_SUBMISSION;
  constructor(public payload: UserDetailTestSubmission) {}
}

export class LoadMajorBasedUserMajorDetails implements Action {
  readonly type = LOAD_MAJOR_BASED_USER_MAJOR_DETAILS;
}

export class SetMajorBasedUserMajorDetails implements Action {
  readonly type = SET_MAJOR_BASED_USER_MAJOR_DETAILS;
  constructor(public payload: MajorBasedUserMajorDetail[]) {}
}

export class LoadUniversityBasedUserMajorDetails implements Action {
  readonly type = LOAD_UNIVERSITY_BASED_USER_MAJOR_DETAILS;
}

export class SetUniversityBasedUserMajorDetails implements Action {
  readonly type = SET_UNIVERSITY_BASED_USER_MAJOR_DETAILS;
  constructor(public payload: UniversityBasedUserMajorDetail[]) {}
}

export class SetDetailUserMajorDetail implements Action {
  readonly type = SET_DETAIL_USER_MAJOR_DETAIL;
  constructor(public payload: SelectedUserMajorDetail) {}
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export type UserActions = LoadSubmissions | SetSubmissions | LoadDetailSubmission | SetDetailSubmission | HasErrors | ConfirmErrors
                          | LoadMajorBasedUserMajorDetails | SetMajorBasedUserMajorDetails | LoadUniversityBasedUserMajorDetails
                          | SetUniversityBasedUserMajorDetails | SetDetailUserMajorDetail;
