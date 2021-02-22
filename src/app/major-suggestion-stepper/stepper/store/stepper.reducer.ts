import { Mark } from 'src/app/_models/mark';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import { Subject } from '../../../_models/subject';
import * as StepperActions from './stepper.actions';

export interface State {
  subjects: Subject[];
  marks: Mark[];
  isLoading: boolean;
  isSuggest: boolean;
  suggestedSubjectsGroup: SuggestedSubjectsGroup[]
}

const initialState: State = {
  subjects: [],
  isLoading: false,
  marks: [],
  isSuggest: false,
  suggestedSubjectsGroup: []
};

export function stepReducer(
  state = initialState,
  action: StepperActions.StepperActions
) {
  switch (action.type) {
    case StepperActions.LOAD_SUBJECTS:
      return {
        ...state,
        isLoading: true,
      };
    case StepperActions.SET_SUBJECTS:
      return {
        ...state,
        subjects: [...action.payload],
        isLoading: false,
      };
    case StepperActions.SET_MARKS:
      return {
        ...state,
        marks: [...action.payload],
      };
    case StepperActions.SET_IS_SUGGEST:
      return {
        ...state,
        isSuggest: action.payload,
        isLoading: true
      };
    case StepperActions.SET_SUGGESTED_SUBJECTS_GROUP:
      return {
        ...state,
        suggestedSubjectsGroup: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
