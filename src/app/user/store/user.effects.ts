import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
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
      return this.http.get<UserTestSubmission[]>(
        environment.apiUrl + 'api/v1/test-submission'
      );
    }),
    map((response) => {
      return new UserActions.SetSubmissions(response);
    })
  );

  @Effect()
  loadUserDetailSubmission = this.actions$.pipe(
    ofType(UserActions.LOAD_DETAIL_SUBMISSION),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, stepperState]) => {
      return this.http.get<UserDetailTestSubmission>(
        environment.apiUrl + 'api/v1/test-submission/' + stepperState.selectedTestSubmissionId.toString()
      );
    }),
    map((response) => {
      return new UserActions.SetDetailSubmission(response);
    })
  );
}