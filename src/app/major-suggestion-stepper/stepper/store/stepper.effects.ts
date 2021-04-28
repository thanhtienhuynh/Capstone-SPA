import { HttpClient, HttpParams } from '@angular/common/http';
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
import { University, UniversityBaseOnTrainingProgram } from 'src/app/_models/university';
import { Test } from 'src/app/_models/test';
import { MarkParam } from 'src/app/_params/mark-param';
import { TestSubmission } from 'src/app/_models/test-submission';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { BaseResponse } from 'src/app/_models/base-response';
import { SaveTestSubmissionParam, TestSubmissionParam } from 'src/app/_params/question-param';
import { environment } from 'src/environments/environment';
import { AddUserMajorDetailParam, RemoveUserMajorDetailParam } from 'src/app/_params/user-major-detail-param';
import { categories } from '@ctrl/ngx-emoji-mart/ngx-emoji';

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
      return this.http.get<Subject[]>(environment.apiUrl + 'api/v1/subject');
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
      return this.http.post<SuggestedSubjectsGroup[]>(
        environment.apiUrl + 'api/v1/subject-group/top-subject-group',
        new MarkParam(stepperState.marks, 2)
      );
    }),
    map((suggestedGroup) => {
      return new StepperActions.SetSuggestedSubjectsGroup(suggestedGroup);
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
      return this.http.get<UniversityBaseOnTrainingProgram[]>(
        environment.apiUrl + 'api/v1/university/suggestion',
        {
          params: queryParams
        }
      );
    }),
    map((universitiesBaseOnTrainingProgram) => {
      return new StepperActions.SetUniversities(universitiesBaseOnTrainingProgram);
    })
  );

  @Effect()
  loadTests = this.actions$.pipe(
    ofType(StepperActions.LOAD_TESTS),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('SubjectGroupId', stepperState.selectedGroupId.toString());
      return this.http.get<ClassifiedTests[]>(
        environment.apiUrl + 'api/v1/test/recommendation',
        {
          params: queryParams
        }
      );
    }),
    map((tests) => {
      return new StepperActions.SetTests(tests);
    })
  );

  @Effect()
  loadTest = this.actions$.pipe(
    ofType(StepperActions.LOAD_TEST),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.get<Test>(
        environment.apiUrl + 'api/v1/test/' + stepperState.selectedTestId.toString()
      );
    }),
    map((test) => {
      return new StepperActions.SetTest(test);
    })
  );

  @Effect()
  scoringTest = this.actions$.pipe(
    ofType(StepperActions.SCORING_TEST),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<TestSubmission>(
        environment.apiUrl + 'api/v1/test-submission', stepperState.testSubmissionParam
      );
    }),
    map((testSubmissionReponse) => {
      return new StepperActions.SetTestMark(testSubmissionReponse);
    })
  );

  @Effect()
  saveTestSubmission = this.actions$.pipe(
    ofType(StepperActions.SAVE_TEST_SUBMISSION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      let testParam = stepperState.testSubmissionParam;
      return this.http.post<BaseResponse>(
        environment.apiUrl + 'api/v1/test-submission/saving',
        new SaveTestSubmissionParam(
          testParam.testId,
          testParam.spentTime,
          testParam.questions,
          stepperState.testSubmissionReponse.mark,
          stepperState.testSubmissionReponse.numberOfRightAnswers,
          stepperState.selectedMajorId,
          stepperState.selectedUniversityId,
          stepperState.selectedTrainingProgramId
        )
      );
    }),
    map((response) => {
      return new StepperActions.SaveTestSubmissionSuccess(response.isSuccess);
    })
  );

  @Effect()
  caringAction = this.actions$.pipe(
    ofType(StepperActions.CARING_ACTION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<any>(
        environment.apiUrl + 'api/v1/user-major-detail',
        new AddUserMajorDetailParam(
          stepperState.selectedUniversityId,
          stepperState.selectedTrainingProgramId,
          stepperState.selectedMajorId,
          stepperState.selectedGroupId,
          new MarkParam(stepperState.marks, 2),
          stepperState.totalMark
        )
      ).pipe(
        map((response) => {
          return new StepperActions.LoadUniversities(
            {totalMark: stepperState.totalMark, subjectGroupId: stepperState.selectedGroupId, majorId: stepperState.selectedMajorId}
          );
        }),
        catchError((error) => {
          console.log(error);
          return of(new StepperActions.CaringActionUnsuccess(error));
        })
      );
    }),
  );

  @Effect()
  uncaringAction = this.actions$.pipe(
    ofType(StepperActions.UNCARING_ACTION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<any>(
        environment.apiUrl + 'api/v1/user-major-detail/deletion',
        new RemoveUserMajorDetailParam(
          stepperState.selectedUniversityId,
          stepperState.selectedTrainingProgramId,
          stepperState.selectedMajorId
        )
      ).pipe(
        map((response) => {
          return new StepperActions.LoadUniversities(
            {totalMark: stepperState.totalMark, subjectGroupId: stepperState.selectedGroupId, majorId: stepperState.selectedMajorId}
          );
        }),
        catchError((error) => {
          console.log(error);
          return of(new StepperActions.UncaringActionUnsuccess(error));
        })
      );
    }),
  );
}
