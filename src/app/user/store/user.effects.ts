import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { MajorBasedFollowingDetail } from "src/app/_models/major-based-following-detail";
import { RankingUserInformationGroupByTranscriptType } from "src/app/_models/ranking-user-information";
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
    switchMap(() => {
      return this.http.get<Response<UserTestSubmission[]>>(
        environment.apiUrl + 'api/v1/test-submission'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetSubmissions(response.data);
          }
          return new UserActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadUserDetailSubmission = this.actions$.pipe(
    ofType(UserActions.LOAD_DETAIL_SUBMISSION),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, stepperState]) => {
      return this.http.get<Response<UserDetailTestSubmission>>(
        environment.apiUrl + 'api/v1/test-submission/' + stepperState.selectedTestSubmissionId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetDetailSubmission(response.data);
          }
          return new UserActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors([error.message]));
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
          return new UserActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors([error.message]));
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
          return new UserActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadUserRankingInformation = this.actions$.pipe(
    ofType(UserActions.LOAD_RANKING_USER_INFORMATION),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, stepperState]) => {
      if (!stepperState.selectedFollowingDetail) {
        return of ({ type: 'DUMMY' }); 
      }
      return this.http.get<Response<RankingUserInformationGroupByTranscriptType[]>>(
        environment.apiUrl + 'api/v1/following-detail/users-group-by-major-detail/' + stepperState.selectedFollowingDetail.universityGroupByTrainingProgramDataSet.followingDetailId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new UserActions.SetRankingUserInformation(response.data);
          }
          return new UserActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors([error.message]));
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
          return new UserActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new UserActions.HasErrors([error.message]));
        })
      );
    })
  );
}