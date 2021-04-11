import { Action } from "@ngrx/store";
import { UserTestSubmission } from "src/app/_models/user-test-submission";

export const LOAD_SUBMISSIONS = '[User] Load Submissions';
export const SET_SUBMISSIONS = '[User] Set Submissions';
export const LOAD_DETAIL_SUBMISSION = '[User] Load Detail Submission';
export const SET_DETAIL_SUBMISSION = '[User] Set Question Submission';

export class LoadSubmissions implements Action {
  readonly type = LOAD_SUBMISSIONS;
}

export class SetSubmissions implements Action {
  readonly type = SET_SUBMISSIONS;
  constructor(public payload: UserTestSubmission[]) {}
}
export type UserActions = LoadSubmissions | SetSubmissions;
