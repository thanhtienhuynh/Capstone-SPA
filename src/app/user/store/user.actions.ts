import { Action } from "@ngrx/store";
import { MajorBasedFollowingDetail } from "src/app/_models/major-based-following-detail";
import { RankingUserInformationGroupByTranscriptType } from "src/app/_models/ranking-user-information";
import { SelectedFollowingDetail } from "src/app/_models/selected-following-detail";
import { UniversityBasedFollowingDetail } from "src/app/_models/university-based-following-detail";
import { UserDetailTestSubmission, UserTestSubmission } from "src/app/_models/user-test-submission";
import { TranscriptType } from "src/app/_models/transcript";

export const LOAD_SUBMISSIONS = '[User] Load Submissions';
export const SET_SUBMISSIONS = '[User] Set Submissions';
export const LOAD_DETAIL_SUBMISSION = '[User] Load Detail Submission';
export const SET_DETAIL_SUBMISSION = '[User] Set Question Submission';
export const LOAD_MAJOR_BASED_FOLLOWING_DETAILS = '[User] Load Major Based Following Details';
export const SET_MAJOR_BASED_FOLLOWING_DETAILS = '[User] Set Major Based Following Details';
export const LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS = '[User] Load University Based Following Details';
export const SET_UNIVERSITY_BASED_FOLLOWING_DETAILS = '[User] Set University Based Following Details';
export const SET_DETAIL_FOLLOWING_DETAIL = '[User] Set Detail Following Detail';
export const LOAD_RANKING_USER_INFORMATION = '[User] Load Ranking User Information';
export const SET_RANKING_USER_INFORMATION = '[User] Set Ranking User Information';
export const LOAD_TRANSCRIPTS = '[User] Load Transcripts';
export const SET_TRANSCRIPTS = '[User] Set Transcripts';
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

export class LoadMajorBasedFollowingDetails implements Action {
  readonly type = LOAD_MAJOR_BASED_FOLLOWING_DETAILS;
}

export class SetMajorBasedFollowingDetails implements Action {
  readonly type = SET_MAJOR_BASED_FOLLOWING_DETAILS;
  constructor(public payload: MajorBasedFollowingDetail[]) {}
}

export class LoadUniversityBasedFollowingDetails implements Action {
  readonly type = LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS;
}

export class SetUniversityBasedFollowingDetails implements Action {
  readonly type = SET_UNIVERSITY_BASED_FOLLOWING_DETAILS;
  constructor(public payload: UniversityBasedFollowingDetail[]) {}
}

export class SetDetailFollowingDetail implements Action {
  readonly type = SET_DETAIL_FOLLOWING_DETAIL;
  constructor(public payload: SelectedFollowingDetail) {}
}

export class LoadRankingUserInformation implements Action {
  readonly type = LOAD_RANKING_USER_INFORMATION;
}

export class SetRankingUserInformation implements Action {
  readonly type = SET_RANKING_USER_INFORMATION;
  constructor(public payload: RankingUserInformationGroupByTranscriptType[]) {}
}

export class LoadTranscripts implements Action {
  readonly type = LOAD_TRANSCRIPTS;
}

export class SetTranscripts implements Action {
  readonly type = SET_TRANSCRIPTS;
  constructor(public payload: TranscriptType[]) {}
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export type UserActions = LoadSubmissions | SetSubmissions | LoadDetailSubmission | SetDetailSubmission | HasErrors | ConfirmErrors
                          | LoadMajorBasedFollowingDetails | SetMajorBasedFollowingDetails | LoadUniversityBasedFollowingDetails
                          | SetUniversityBasedFollowingDetails | SetDetailFollowingDetail | LoadRankingUserInformation
                          | SetRankingUserInformation | LoadTranscripts | SetTranscripts;
