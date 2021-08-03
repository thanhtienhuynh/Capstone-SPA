import { User } from 'src/app/_models/user';
import * as AuthActions from './auth.actions';

export interface State {
  isLoading: boolean;
  firebaseToken: string;
  registerToken: string;
  user: User;
  token: string;
  shoudLogout: boolean;
  errors: string[];
}

const initialState: State = {
  isLoading: false,
  firebaseToken: null,
  user: null,
  token: null,
  registerToken: null,
  shoudLogout: false,
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
    case AuthActions.SET_REGISTER_TOKEN:
      return {
        ...state,
        registerToken: action.payload
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        firebaseToken: null,
        user: null,
        token: null,
        shoudLogout: false,
        // registerToken: null,
      };
    case AuthActions.SHOULD_LOGOUT:
      return {
        ...state,
        shoudLogout: action.payload,
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
