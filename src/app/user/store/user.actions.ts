import { Action } from "@ngrx/store";
import { MajorBasedFollowingDetail } from "src/app/_models/major-based-following-detail";
import { UserFollowingDetail } from "src/app/_models/ranking-user-information";
import { UniversityBasedFollowingDetail } from "src/app/_models/university-based-following-detail";
import { TestSubmissionDetailParam, UserDetailTestSubmission, UserTestSubmission } from "src/app/_models/user-test-submission";
import { TranscriptType } from "src/app/_models/transcript";
import { CollapseArticle } from "src/app/_models/collapse-article";
import { NotificationDataSet } from "src/app/_models/notification";
import { PagedResponse } from "src/app/_models/paged-response";

export const LOAD_SUBMISSIONS = '[User] Load Submissions';
export const SET_SUBMISSIONS = '[User] Set Submissions';
export const LOAD_DETAIL_SUBMISSION = '[User] Load Detail Submission';
export const SET_DETAIL_SUBMISSION = '[User] Set Question Submission';
export const LOAD_MAJOR_BASED_FOLLOWING_DETAILS = '[User] Load Major Based Following Details';
export const SET_MAJOR_BASED_FOLLOWING_DETAILS = '[User] Set Major Based Following Details';
export const LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS = '[User] Load University Based Following Details';
export const SET_UNIVERSITY_BASED_FOLLOWING_DETAILS = '[User] Set University Based Following Details';
export const LOAD_USER_FOLLOWING_DETAIL = '[User] Load User Following Detail';
export const SET_USER_FOLLOWING_DETAIL = '[User] Set Ranking User Information';
export const LOAD_TRANSCRIPTS = '[User] Load Transcripts';
export const SET_TRANSCRIPTS = '[User] Set Transcripts';
export const LOAD_CARING_ARTICLES = '[User] Load Caring Articles';
export const SET_CARING_ARTICLES = '[User] Set Caring Articles';
export const SET_NOTIFICATION_ARTICLE_IDS = '[User] Set Notification Article Ids';
export const LOAD_NUMBER_OF_UNREAD_NOTIFICATIONS = '[User] Load Number Of Unread Notifications';
export const SET_NUMBER_OF_UNREAD_NOTIFICATIONS = '[User] Set Number Of Unread Notifications';
export const MARK_AS_ALL_READ = '[User] Mark As All Read';
export const MARK_AS_READ = '[User] Mark As Read';
export const LOAD_NOTIFICATIONS = '[User] Load Notifications';
export const SET_NOTIFICATIONS = '[User] Set Notifications';
export const LOAD_MORE_NOTIFICATIONS = '[User] Load More Notifications';
export const SET_MORE_NOTIFICATIONS = '[User] Set More Notifications';
export const UNCARING_ACTION = '[User] Uncaring Action';
export const DONE_LOADING = '[User] Done Loading';
export const HAS_ERRORS = '[User] Has Errors';
export const CONFIRM_ERRORS = '[User] Confirm Errors';

export class LoadSubmissions implements Action {
  readonly type = LOAD_SUBMISSIONS;
  readonly message = "Đang tìm các bài thi";
  constructor(public payload: TestSubmissionDetailParam) {}
}

export class SetSubmissions implements Action {
  readonly type = SET_SUBMISSIONS;
  constructor(public payload: UserTestSubmission[]) {}
}

export class LoadDetailSubmission implements Action {
  readonly type = LOAD_DETAIL_SUBMISSION;
  readonly message = "Đang nạp chi tiết bài thi";
  constructor(public payload: number) {}
}

export class SetDetailSubmission implements Action {
  readonly type = SET_DETAIL_SUBMISSION;
  constructor(public payload: UserDetailTestSubmission) {}
}

export class LoadMajorBasedFollowingDetails implements Action {
  readonly type = LOAD_MAJOR_BASED_FOLLOWING_DETAILS;
  readonly message = "Đang tìm các ngành học đã theo dõi";
}

export class SetMajorBasedFollowingDetails implements Action {
  readonly type = SET_MAJOR_BASED_FOLLOWING_DETAILS;
  constructor(public payload: MajorBasedFollowingDetail[]) {}
}

export class LoadUniversityBasedFollowingDetails implements Action {
  readonly type = LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS;
  readonly message = "Đang tìm các trường đại học đã theo dõi";
}

export class SetUniversityBasedFollowingDetails implements Action {
  readonly type = SET_UNIVERSITY_BASED_FOLLOWING_DETAILS;
  constructor(public payload: UniversityBasedFollowingDetail[]) {}
}

export class LoadUserFollowingDetail implements Action {
  readonly type = LOAD_USER_FOLLOWING_DETAIL;
  readonly message = "Đang nạp chi tiết khối ngành";
  constructor(public payload: number) {}
}

export class SetUserFollowingDetail implements Action {
  readonly type = SET_USER_FOLLOWING_DETAIL;
  constructor(public payload: UserFollowingDetail) {}
}

export class LoadTranscripts implements Action {
  readonly type = LOAD_TRANSCRIPTS;
  readonly message = "Đang nạp thông tin tài khoản";
}

export class SetTranscripts implements Action {
  readonly type = SET_TRANSCRIPTS;
  constructor(public payload: TranscriptType[]) {}
}

export class LoadCaringArticles implements Action {
  readonly type = LOAD_CARING_ARTICLES;
}

export class SetCaringArticles implements Action {
  readonly type = SET_CARING_ARTICLES;
  constructor(public payload: CollapseArticle[]) {}
}

export class SetNotificationArticleIds implements Action {
  readonly type = SET_NOTIFICATION_ARTICLE_IDS;
  constructor(public payload: number) {}
}

export class UncaringAction implements Action {
  readonly type = UNCARING_ACTION;
  constructor(public payload: {uncaringType: number, followingDetailId: number}) {}
}

export class LoadNumberOfUnreadNotifications implements Action {
  readonly type = LOAD_NUMBER_OF_UNREAD_NOTIFICATIONS;
}

export class SetNumberOfUnreadNotifications implements Action {
  readonly type = SET_NUMBER_OF_UNREAD_NOTIFICATIONS;
  constructor(public payload: number) {}
}

export class LoadNotifications implements Action {
  readonly type = LOAD_NOTIFICATIONS;
}

export class SetNotifications implements Action {
  readonly type = SET_NOTIFICATIONS;
  constructor(public payload: PagedResponse<NotificationDataSet[]>) {}
}

export class MarkAsAllRead implements Action {
  readonly type = MARK_AS_ALL_READ;
}

export class MarkAsRead implements Action {
  readonly type = MARK_AS_READ;
  constructor(public payload: number) {}
}

export class LoadMoreNotifications implements Action {
  readonly type = LOAD_MORE_NOTIFICATIONS;
}

export class SetMoreNotifications implements Action {
  readonly type = SET_MORE_NOTIFICATIONS;
  constructor(public payload: PagedResponse<NotificationDataSet[]>) {}
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

export type UserActions = LoadSubmissions | SetSubmissions | LoadDetailSubmission | SetDetailSubmission | HasErrors | ConfirmErrors
                          | LoadMajorBasedFollowingDetails | SetMajorBasedFollowingDetails | LoadUniversityBasedFollowingDetails
                          | SetUniversityBasedFollowingDetails | LoadUserFollowingDetail | LoadNotifications | SetNotifications
                          | SetUserFollowingDetail | LoadTranscripts | SetTranscripts | LoadCaringArticles | SetCaringArticles
                          | SetNotificationArticleIds | UncaringAction | LoadMoreNotifications | SetMoreNotifications
                          | LoadNumberOfUnreadNotifications | SetNumberOfUnreadNotifications | MarkAsAllRead | MarkAsRead
                          | DoneLoading;
