import { Action } from "@ngrx/store";
import { User } from "src/app/_models/user";

export const LOGIN_GOOGLE = '[Auth] Login Goole';
export const LOGIN_SERVER = '[Auth] Login Server';
export const SET_USER = '[Auth] Set User';

export class LoginGoogle implements Action {
  readonly type = LOGIN_GOOGLE;
}

export class LoginServer implements Action {
  readonly type = LOGIN_SERVER;
  constructor(public payload: string) {}
}

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) {}
}

export type AuthActions = LoginGoogle | LoginServer | SetUser;