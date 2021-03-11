import { User } from 'src/app/_models/user';
import * as AuthActions from './auth.actions';

export interface State {
  isLoading: boolean;
  firebaseToken: string;
  user: User;
}

const initialState: State = {
  isLoading: false,
  firebaseToken: null,
  user: null,
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
        firebaseToken: action.payload
      };
    case AuthActions.SET_USER:
        return {
          ...state,
          isLoading: false,
          user: action.payload
        };
    default:
      return state;
  }
}
