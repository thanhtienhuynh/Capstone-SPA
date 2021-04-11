import { User } from 'src/app/_models/user';
import { UserDetailTestSubmission, UserTestSubmission } from 'src/app/_models/user-test-submission';
import * as UserActions from './user.actions';

export interface State {
  isLoading: boolean;
  testSubmissions: UserTestSubmission[];
  detailTestSubmission: UserDetailTestSubmission[];
}

const initialState: State = {
  isLoading: false,
  testSubmissions: null,
  detailTestSubmission: null
};

export function userReducer(
  state = initialState,
  action: UserActions.UserActions
) {
  switch (action.type) {
    case UserActions.LOAD_SUBMISSIONS:
      return {
        ...state,
        isLoading: true,
      };
    case UserActions.SET_SUBMISSIONS:
      return {
        ...state,
        isLoading: false,
        testSubmissions: action.payload
      };
   
    default:
      return state;
  }
}
