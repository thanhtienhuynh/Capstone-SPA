import { ActionReducerMap } from '@ngrx/store';

import * as fromStepper from '../major-suggestion-stepper/stepper/store/stepper.reducer';
import * as fromAuth from '../authentication/store/auth.reducer';
import * as fromUser from '../user/store/user.reducer';
import * as fromHome from '../home/store/home.reducer';

export interface AppState {
  stepper: fromStepper.State;
  auth: fromAuth.State;
  user: fromUser.State;
  home: fromHome.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  stepper: fromStepper.stepReducer,
  auth: fromAuth.authReducer,
  user: fromUser.userReducer,
  home: fromHome.homeReducer
};
