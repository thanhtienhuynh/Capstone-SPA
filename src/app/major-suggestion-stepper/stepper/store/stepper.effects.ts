import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as StepperActions from './stepper.actions';
import {
  switchMap,
  catchError,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Subject } from '../../../_models/subject';
import { Injectable } from '@angular/core';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import * as fromApp from '../../../_store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class StepperEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  @Effect()
  loadSubjects = this.actions$.pipe(
    ofType(StepperActions.LOAD_SUBJECTS),
    switchMap(() => {
      return this.http.get<Subject[]>('https://localhost:44344/api/v1/subject');
    }),
    map((subjects) => {
      return new StepperActions.SetSubjects(subjects);
    })
  );

  @Effect()
  loadResult = this.actions$.pipe(
    ofType(StepperActions.SET_MARKS),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      console.log(stepperState.marks);
      return this.http.post<SuggestedSubjectsGroup[]>(
        'https://localhost:44344/api/v1/subject-group/top-subject-group',
        {
          marks: stepperState.marks,
          isSuggest: true,
        }
      );
    }),
    map((suggestedGroup) => {
      return new StepperActions.SetSuggestedSubjectsGroup(suggestedGroup);
    })
  );
}
