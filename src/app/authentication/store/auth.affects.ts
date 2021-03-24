import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../_store/app.reducer';
import * as AuthActions from './auth.actions';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/_models/user';
import { LoginResponse } from 'src/app/_models/login-response';
import * as Consts from '../../_common/constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router';


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
  loadSubjects = this.actions$.pipe(
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
      return this.http.post<LoginResponse>(
        'https://localhost:44344/api/v1/user/auth/google',
        { uidToken: authState.firebaseToken }
      );
    }),
    tap(resData => {
      const expirationDuration =
      this.helper.getTokenExpirationDate(resData.token).getTime() - new Date().getTime();
      this.authService.setLogoutTimer(expirationDuration);
    }),
    map((response: LoginResponse) => {
      localStorage.setItem("token", response.token);
      return new AuthActions.SetUser(response);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const token = localStorage.getItem('token');
      const user = this.helper.decodeToken(token);
      if (!user) {
        return { type: 'DUMMY' };
      }
      console.log("User: ", user);

      const loadedUser: User = {
        avatarUrl: user[Consts.JWT_AVATAR],
        email: user[Consts.JWT_EMAIL],
        id: user["sub"],
        isAdmin: user[Consts.JWT_ROLE] == Consts.JWT_ADMIN_ROLE,
        fullname: user[Consts.JWT_NAME],
        phone: user[Consts.JWT_PHONE]
      };

      if (token) {
        const expirationDuration =
        this.helper.getTokenExpirationDate(token).getTime() - new Date().getTime();
        console.log("Time: ", expirationDuration, " Exp: ", this.helper.getTokenExpirationDate(token));
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.SetUser({
          user: loadedUser,
          token: token
        });
      }
      return { type: 'DUMMY' };
    })
  );
  
  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    })
  );

  @Effect({ dispatch: false })
  setUser = this.actions$.pipe(
    ofType(AuthActions.SET_USER),
    withLatestFrom(this.store.select('auth')),
    tap(([actionData, authState]) => {
      if (authState.user.isAdmin) {
        this.router.navigate(['/admin']);
      } 
    })
  );
}
