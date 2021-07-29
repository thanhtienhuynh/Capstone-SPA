import { Action } from "@ngrx/store";
import { User } from "src/app/_models/user";
import { LoginResponse } from "src/app/_models/login-response";

export const LOGIN_GOOGLE = '[Auth] Login Goole';
export const LOGIN_SERVER = '[Auth] Login Server';
export const SET_USER = '[Auth] Set User';
export const SET_REGISTER_TOKEN = '[Auth] Set Register Token';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const SHOULD_LOGOUT = '[Auth] Should Logout';
export const HAS_ERRORS = '[Auth] Has Errors';
export const CONFIRM_ERRORS = '[Auth] Confirm Errors';

export class LoginGoogle implements Action {
  readonly type = LOGIN_GOOGLE;
}

export class LoginServer implements Action {
  readonly type = LOGIN_SERVER;
  constructor(public payload: string) {}
}

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: LoginResponse) {}
}

export class SetRegisterToken implements Action {
  readonly type = SET_REGISTER_TOKEN;
  constructor(public payload: string) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class ShouldLogout implements Action {
  readonly type = SHOULD_LOGOUT;
  constructor(public payload: boolean) {}
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export type AuthActions = LoginGoogle | LoginServer | SetUser | AutoLogin | Logout | ShouldLogout | HasErrors | ConfirmErrors
                          | SetRegisterToken;
