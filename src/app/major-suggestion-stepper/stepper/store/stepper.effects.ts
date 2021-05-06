import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as StepperActions from './stepper.actions';
import {
  switchMap,
  catchError,
  map,
  tap,
  withLatestFrom,
  delay,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Subject } from '../../../_models/subject';
import { Injectable } from '@angular/core';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import * as fromApp from '../../../_store/app.reducer';
import { Store } from '@ngrx/store';
import { UniversityBaseOnTrainingProgram } from 'src/app/_models/university';
import { Test } from 'src/app/_models/test';
import { MarkParam } from 'src/app/_params/mark-param';
import { TestSubmission } from 'src/app/_models/test-submission';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { SaveTestSubmissionParam } from 'src/app/_params/question-param';
import { environment } from 'src/environments/environment';
import { AddUserMajorDetailParam, RemoveUserMajorDetailParam } from 'src/app/_params/user-major-detail-param';
import { Response } from 'src/app/_models/response';

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
      return this.http.get<Response<Subject[]>>(environment.apiUrl + 'api/v1/subject')
      .pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetSubjects(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    }),
    
  );

  @Effect()
  loadResult = this.actions$.pipe(
    ofType(StepperActions.SET_MARKS),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<Response<SuggestedSubjectsGroup[]>>(
        environment.apiUrl + 'api/v1/subject-group/top-subject-group',
        new MarkParam(stepperState.marks, stepperState.transcriptTypeId)
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetSuggestedSubjectsGroup(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadUniversities = this.actions$.pipe(
    ofType(StepperActions.LOAD_UNIVERSIIES, StepperActions.RELOAD_UNIVERSIIES),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('SubjectGroupId', stepperState.selectedGroupId.toString());
      queryParams = queryParams.append('MajorId', stepperState.selectedMajorId.toString());
      queryParams = queryParams.append('TotalMark', stepperState.totalMark.toString());
      queryParams = queryParams.append('TranscriptTypeId', '2');
      return this.http.get<Response<UniversityBaseOnTrainingProgram[]>>(
        environment.apiUrl + 'api/v1/university/suggestion',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetUniversities(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadTests = this.actions$.pipe(
    ofType(StepperActions.LOAD_TESTS),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('SubjectGroupId', stepperState.selectedGroupId.toString());
      return this.http.get<Response<ClassifiedTests[]>>(
        environment.apiUrl + 'api/v1/test/recommendation',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetTests(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadSelectedTest = this.actions$.pipe(
    ofType(StepperActions.LOAD_TEST),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.get<Response<Test>>(
        environment.apiUrl + 'api/v1/test/' + stepperState.selectedTestId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetTest(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  scoringTest = this.actions$.pipe(
    ofType(StepperActions.SCORING_TEST),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<Response<TestSubmission>>(
        environment.apiUrl + 'api/v1/test-submission', stepperState.testSubmissionParam
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetTestMark(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  saveTestSubmission = this.actions$.pipe(
    ofType(StepperActions.SAVE_TEST_SUBMISSION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      let testParam = stepperState.testSubmissionParam;
      return this.http.post<Response<any>>(
        environment.apiUrl + 'api/v1/test-submission/saving',
        new SaveTestSubmissionParam(
          testParam.testId,
          testParam.spentTime,
          testParam.questions,
          stepperState.testSubmissionReponse.mark,
          stepperState.testSubmissionReponse.numberOfRightAnswers
        )
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SaveTestSubmissionSuccess(response.succeeded);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  caringAction = this.actions$.pipe(
    ofType(StepperActions.CARING_ACTION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<Response<any>>(
        environment.apiUrl + 'api/v1/user-major-detail',
        new AddUserMajorDetailParam(
          stepperState.selectedUniversityId,
          stepperState.selectedTrainingProgramId,
          stepperState.selectedMajorId,
          stepperState.selectedGroupId,
          new MarkParam(stepperState.marks, stepperState.transcriptTypeId),
          stepperState.totalMark
        )
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.LoadUniversities(
              {totalMark: stepperState.totalMark, subjectGroupId: stepperState.selectedGroupId, majorId: stepperState.selectedMajorId}
            );
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  uncaringAction = this.actions$.pipe(
    ofType(StepperActions.UNCARING_ACTION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<Response<any>>(
        environment.apiUrl + 'api/v1/user-major-detail/deletion',
        new RemoveUserMajorDetailParam(
          stepperState.selectedUniversityId,
          stepperState.selectedTrainingProgramId,
          stepperState.selectedMajorId
        )
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.LoadUniversities(
              {totalMark: stepperState.totalMark, subjectGroupId: stepperState.selectedGroupId, majorId: stepperState.selectedMajorId}
            );
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    }),
  );
}
