import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../_store/app.reducer';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/_models/user';
import { LoginResponse } from 'src/app/_models/login-response';
import * as Consts from '../../_common/constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Response } from 'src/app/_models/response';


@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private angularAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
  ) {}

  helper = new JwtHelperService();

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
      return new AuthActions.LoginServer(token);
    }),
    catchError((error: any) => {
      if(error && error.code == "auth/popup-closed-by-user") {
        return of({type: "DUMMY"});
      }
      return of(new AuthActions.HasErrors([error.message]));
    })
  );

  @Effect()
  loginServer = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SERVER),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actionData, authState]) => {
      return this.http.post<Response<LoginResponse>>(
        environment.apiUrl + 'api/v1/user/auth/google',
        { uidToken: authState.firebaseToken }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            const expirationDuration = this.helper.getTokenExpirationDate(response.data.token).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);
            localStorage.setItem("token", response.data.token);
            return new AuthActions.SetUser(response.data);
          }
          return new AuthActions.HasErrors(response.errors);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new AuthActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    switchMap(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // this.router.navigate(['/']);
        return of({type: "DUMMY"});
      }
      return this.http.get<Response<User>>(
        environment.apiUrl + 'api/v1/user/validation'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            const expirationDuration = this.helper.getTokenExpirationDate(token).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);
            localStorage.setItem("token", token);
            return new AuthActions.SetUser({token: token, user: response.data});
          }
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          return of(new AuthActions.HasErrors(response.errors));
        }),
        catchError((error: HttpErrorResponse) => {
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          return of(new AuthActions.HasErrors([error.message]));
        })
      )
    })
  );
  
  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actionData, authState]) => {
      return this.http.post<Response<boolean>>(
        environment.apiUrl + 'api/v1/user/unsubscribe',
        { token: authState.registerToken }
      ).pipe(
        map((response) => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          if (response.succeeded) {
            console.log("unsubscribe success!");
          } else {
            console.log("unsubscribe fail!");
          }
          return { type: 'DUMMY' };
        }),
        catchError((error: HttpErrorResponse) => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          return of({ type: 'DUMMY' });
        })
      );
    }),
  );

  @Effect({ dispatch: false })
  subscribeTopic = this.actions$.pipe(
    ofType(AuthActions.SET_REGISTER_TOKEN),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actionData, authState]) => {
      return this.http.post<Response<boolean>>(
        environment.apiUrl + 'api/v1/user/subscribe',
        { token: authState.registerToken }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            console.log("subscribe success!");
          } else {
            console.log("subscribe fail!");
          }
          return { type: 'DUMMY' };
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new AuthActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect({ dispatch: false })
  setUser = this.actions$.pipe(
    ofType(AuthActions.SET_USER),
    withLatestFrom(this.store.select('auth')),
    tap(([actionData, authState]) => {
      if (authState.user.roleId == 1 || authState.user.roleId == 3) {
        this.router.navigate(['/admin']);
      } 
    })
  );
}
