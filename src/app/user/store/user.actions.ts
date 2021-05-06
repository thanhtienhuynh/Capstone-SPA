import { Action } from "@ngrx/store";
import { UserDetailTestSubmission, UserTestSubmission } from "src/app/_models/user-test-submission";

export const LOAD_SUBMISSIONS = '[User] Load Submissions';
export const SET_SUBMISSIONS = '[User] Set Submissions';
export const LOAD_DETAIL_SUBMISSION = '[User] Load Detail Submission';
export const SET_DETAIL_SUBMISSION = '[User] Set Question Submission';
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

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export type UserActions = LoadSubmissions | SetSubmissions | LoadDetailSubmission | SetDetailSubmission | HasErrors | ConfirmErrors;
