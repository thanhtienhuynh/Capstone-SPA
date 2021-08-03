import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { CollapseArticle } from "src/app/_models/collapse-article";
import { MajorBasedFollowingDetail } from "src/app/_models/major-based-following-detail";
import { NotificationDataSet } from "src/app/_models/notification";
import { PagedResponse } from "src/app/_models/paged-response";
import { UserFollowingDetail } from "src/app/_models/ranking-user-information";
import { Response } from "src/app/_models/response";
import { TranscriptType } from "src/app/_models/transcript";
import { UniversityBasedFollowingDetail } from "src/app/_models/university-based-following-detail";
import { UserDetailTestSubmission, UserTestSubmission } from "src/app/_models/user-test-submission";
import { environment } from "src/environments/environment";
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  @Effect()
  loadUserSubmissions = this.actions$.pipe(
    ofType(UserActions.LOAD_SUBMISSIONS),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      let queryParams = new HttpParams();
      if (userState.testSubmissionParam.testTypeId != null && userState.testSubmissionParam.testTypeId != 0) {
        queryParams = queryParams.append('testTypeId', userState.testSubmissionParam.testTypeId.toString());
      }
      if (userState.testSubmissionParam.subjectId != null && userState.testSubmissionParam.subjectId != 0) {
        queryParams = queryParams.append('subjectId', userState.testSubmissionParam.subjectId.toString());
      }
      if (userState.testSubmissionParam.isSuggestedTest != null) {
        queryParams = queryParams.append('isSuggestedTest', userState.testSubmissionParam.isSuggestedTest ? 'true' : 'false');
      }
      queryParams.append('order',userState.testSubmissionParam.order.toString());
      return this.http.get<Response<UserTestSubmission[]>>(
        environment.apiUrl + 'api/v1/test-submission',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetSubmissions(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_SUBMISSIONS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_SUBMISSIONS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadUserDetailSubmission = this.actions$.pipe(
    ofType(UserActions.LOAD_DETAIL_SUBMISSION),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.get<Response<UserDetailTestSubmission>>(
        environment.apiUrl + 'api/v1/test-submission/' + userState.selectedTestSubmissionId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetDetailSubmission(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_DETAIL_SUBMISSION, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_DETAIL_SUBMISSION, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadMajorBasedFollowingDetails = this.actions$.pipe(
    ofType(UserActions.LOAD_MAJOR_BASED_FOLLOWING_DETAILS),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, stepperState]) => {
      return this.http.get<Response<MajorBasedFollowingDetail[]>>(
        environment.apiUrl + 'api/v1/following-detail/group-by-major'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetMajorBasedFollowingDetails(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_MAJOR_BASED_FOLLOWING_DETAILS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_MAJOR_BASED_FOLLOWING_DETAILS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadUniversityBasedFollowingDetails = this.actions$.pipe(
    ofType(UserActions.LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, stepperState]) => {
      return this.http.get<Response<UniversityBasedFollowingDetail[]>>(
        environment.apiUrl + 'api/v1/following-detail/group-by-university'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetUniversityBasedFollowingDetails(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadUserFollowingDetail = this.actions$.pipe(
    ofType(UserActions.LOAD_USER_FOLLOWING_DETAIL),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, stepperState]) => {
      if (!stepperState.selectedFollowingDetailId) {
        return of ({ type: 'DUMMY' }); 
      }
      return this.http.get<Response<UserFollowingDetail>>(
        environment.apiUrl + 'api/v1/following-detail/detail/' + stepperState.selectedFollowingDetailId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            console.log(response.data)
            return new UserActions.SetUserFollowingDetail(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_USER_FOLLOWING_DETAIL, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_USER_FOLLOWING_DETAIL, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadTranscripts = this.actions$.pipe(
    ofType(UserActions.LOAD_TRANSCRIPTS),
    switchMap(() => {
      return this.http.get<Response<TranscriptType[]>>(
        environment.apiUrl + 'api/v1/transcript'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetTranscripts(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_TRANSCRIPTS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_TRANSCRIPTS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadCaringArticles = this.actions$.pipe(
    ofType(UserActions.LOAD_CARING_ARTICLES),
    switchMap(() => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageSize', '10');
      queryParams = queryParams.append('pageNumber', '1');
      return this.http.get<Response<CollapseArticle[]>>(
        environment.apiUrl + 'api/v1/article/following-article',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetCaringArticles(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_CARING_ARTICLES, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_CARING_ARTICLES, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadNotifications = this.actions$.pipe(
    ofType(UserActions.LOAD_NOTIFICATIONS),
    switchMap(() => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageSize', '10');
      queryParams = queryParams.append('pageNumber', '1');
      return this.http.get<PagedResponse<NotificationDataSet[]>>(
        environment.apiUrl + 'api/v1/notification/user',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetNotifications(response);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_NOTIFICATIONS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_NOTIFICATIONS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadMoreNotifications = this.actions$.pipe(
    ofType(UserActions.LOAD_MORE_NOTIFICATIONS),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageSize', '10');
      console.log("page: ", userState.pagedNotifications.pageNumber + 1);
      queryParams = queryParams.append('pageNumber', (userState.pagedNotifications.pageNumber + 1).toString());
      return this.http.get<PagedResponse<NotificationDataSet[]>>(
        environment.apiUrl + 'api/v1/notification/user',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetMoreNotifications(response);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_MORE_NOTIFICATIONS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_MORE_NOTIFICATIONS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  loadNumberOfUnread = this.actions$.pipe(
    ofType(UserActions.LOAD_NUMBER_OF_UNREAD_NOTIFICATIONS),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.get<Response<number>>(
        environment.apiUrl + 'api/v1/notification/unread'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetNumberOfUnreadNotifications(response.data);
          }
          return new UserActions.HasErrors({action: UserActions.LOAD_NUMBER_OF_UNREAD_NOTIFICATIONS, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.LOAD_NUMBER_OF_UNREAD_NOTIFICATIONS, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  markAsRead = this.actions$.pipe(
    ofType(UserActions.MARK_AS_READ),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.put<Response<boolean>>(
        environment.apiUrl + 'api/v1/notification/' + userState.markAsReadId.toString(),
        {}
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.LoadNumberOfUnreadNotifications();
          }
          return new UserActions.HasErrors({action: UserActions.MARK_AS_READ, messages: response.errors});
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.MARK_AS_READ, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  markAsAllRead = this.actions$.pipe(
    ofType(UserActions.MARK_AS_ALL_READ),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.put<Response<boolean>>(
        environment.apiUrl + 'api/v1/notification',
        {}
      ).pipe(
        switchMap((response) => {
          if (response.succeeded) {
            return [new UserActions.LoadNumberOfUnreadNotifications(),
              new UserActions.LoadNotifications()];
          }
          return of(new UserActions.HasErrors({action: UserActions.MARK_AS_ALL_READ, messages: response.errors}));
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors({action: UserActions.MARK_AS_ALL_READ, messages:[error.message]}));
        })
      );
    })
  );

  @Effect()
  uncaringAction = this.actions$.pipe(
    ofType(UserActions.UNCARING_ACTION),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.delete<Response<boolean>>(
        environment.apiUrl + 'api/v1/following-detail/all/' + userState.uncaringFollowingDetailId.toString()
      ).pipe(
        switchMap((response) => {
          if (response.succeeded) {
            console.log("success: ", userState.uncareType);
            if (userState.uncareType == 0) {

              return [new UserActions.LoadMajorBasedFollowingDetails(),
                      new UserActions.DoneLoading(UserActions.UNCARING_ACTION)];
            } else if (userState.uncareType == 1) {
              return [new UserActions.LoadUniversityBasedFollowingDetails(),
                new UserActions.DoneLoading(UserActions.UNCARING_ACTION)];
            }
            return of ({ type: 'DUMMY' }); 
          }
          return of (new UserActions.HasErrors({action: UserActions.UNCARING_ACTION, messages: response.errors}));
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new UserActions.HasErrors({action: UserActions.UNCARING_ACTION, messages: [error.message]}));
        })
      );
    }),
  );
}