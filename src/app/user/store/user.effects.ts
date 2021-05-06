import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Response } from "src/app/_models/response";
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
}