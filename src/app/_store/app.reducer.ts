import { ActionReducerMap } from '@ngrx/store';

import * as fromStepper from '../major-suggestion-stepper/stepper/store/stepper.reducer';

export interface AppState {
  stepper: fromStepper.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  stepper:fromStepper.stepReducer
};
