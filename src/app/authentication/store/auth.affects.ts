import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../_store/app.reducer';
import * as AuthActions from './auth.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { User } from 'src/app/_models/user';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private angularAuth: AngularFireAuth
  ) {}

  @Effect()
  loginGoogle = this.actions$.pipe(
    ofType(AuthActions.LOGIN_GOOGLE),
    switchMap(() => {
      var googleProvider = new firebase.auth.GoogleAuthProvider();
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      return this.angularAuth.signInWithPopup(googleProvider);
    }),
    switchMap((firebaseUser: firebase.auth.UserCredential) => {
      return firebaseUser.user.getIdToken();
    }),
    map((token: string) => {
      console.log(token);
      return new AuthActions.LoginServer(token);
    })
  );

  @Effect()
  loginServer = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SERVER),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actionData, authState]) => {
      return this.http.post<User>(
        'https://localhost:44344/api/v1/user/auth/google',
        { uidToken: authState.firebaseToken }
      );
    }),
    map((user: User) => {
      localStorage.setItem("token", user.token);
      return new AuthActions.SetUser(user);
    })
  );
}
