import { User } from 'src/app/_models/user';
import * as AuthActions from './auth.actions';

export interface State {
  isLoading: boolean;
  firebaseToken: string;
  user: User;
  token: string;
  errors: string[];
}

const initialState: State = {
  isLoading: false,
  firebaseToken: null,
  user: null,
  token: null,
  errors: null
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN_GOOGLE:
      return {
        ...state,
        isLoading: true
      };
    case AuthActions.LOGIN_SERVER:
      return {
        ...state,
        firebaseToken: action.payload,
        isLoading: true,
      };
    case AuthActions.SET_USER:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        firebaseToken: null,
        user: null,
        token: null
      };
    case AuthActions.HAS_ERRORS:
      return {
        ...state,
        errors: action.payload,
        isLoading: false
      };
    case AuthActions.CONFIRM_ERRORS:
      return {
        ...state,
        errors: null,
      };
    default:
      return state;
  }
}
