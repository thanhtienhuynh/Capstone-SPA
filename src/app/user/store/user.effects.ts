import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs/operators";
import { UserTestSubmission } from "src/app/_models/user-test-submission";
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
        'https://localhost:44344/api/v1/test-submission'
      );
    }),
    map((response) => {
      return new UserActions.SetSubmissions(response);
    })
  );
}