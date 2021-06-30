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
import { SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from 'src/app/_models/suggested-subjects-group';
import * as fromApp from '../../../_store/app.reducer';
import { Store } from '@ngrx/store';
import { MockTestBasedUniversity, TrainingProgramBasedUniversity } from 'src/app/_models/university';
import { Test } from 'src/app/_models/test';
import { MarkParam } from 'src/app/_params/mark-param';
import { TestSubmission } from 'src/app/_models/test-submission';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { UnsaveTestSubmission } from 'src/app/_params/question-param';
import { environment } from 'src/environments/environment';
import { AddFollowingDetailParam } from 'src/app/_params/following-detail-param';
import { Response } from 'src/app/_models/response';
import { Province } from 'src/app/_models/province';

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
        new MarkParam(stepperState.marks, stepperState.transcriptTypeId, stepperState.gender, stepperState.provinceId),
        {
          withCredentials: true,
        }
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
      queryParams = queryParams.append('subjectGroupId', stepperState.selectedSubjectGroup.id.toString());
      queryParams = queryParams.append('majorId', stepperState.selectedMajor.id.toString());
      queryParams = queryParams.append('totalMark', stepperState.selectedSubjectGroup.totalMark.toString());
      queryParams = queryParams.append('transcriptTypeId', stepperState.transcriptTypeId.toString());
      queryParams = queryParams.append('gender', stepperState.gender.toString());
      if (stepperState.provinceId) {
        queryParams = queryParams.append('provinceId', stepperState.provinceId.toString());
      }
      return this.http.get<Response<TrainingProgramBasedUniversity[]>>(
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
  loadMockTestUniversity = this.actions$.pipe(
    ofType(StepperActions.LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      var hbMarks = stepperState.marks.slice();
      var mockTestMarks = stepperState.testMarks;
      if (stepperState.tests == null || mockTestMarks == null || stepperState.tests.length == 0 || mockTestMarks.length != stepperState.tests.length) {
        return of(new StepperActions.DoneLoading());
      }
      for(var i = 0, l = hbMarks.length; i < l; i++) {
        for(var j = 0, ll = mockTestMarks.length; j < ll; j++) {
            if(hbMarks[i].subjectId === mockTestMarks[j].subjectId) {
              hbMarks.splice(i, 1, mockTestMarks[j]);
                  break;
              }
          }
      }
      hbMarks = hbMarks.filter(m => stepperState.selectedSubjectGroup.subjectDataSets.find(s =>  s.id == m.subjectId) != null
                                  || stepperState.selectedSubjectGroup.specialSubjectGroups?.find(g => g.subjects.find(t => t.id ==  m.subjectId) != null) != null);
      let body = {
        subjectGroupId: stepperState.selectedSubjectGroup.id,
        majorId: stepperState.selectedMajor.id,
        transcriptTypeId: 2,
        gender: stepperState.gender,
        provinceId: stepperState.provinceId,
        marks: hbMarks
      }
      return this.http.post<Response<MockTestBasedUniversity>>(
        environment.apiUrl + 'api/v1/university/suggestion',
        body
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetAfterMockTestsUniversities(response.data);
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
      queryParams = queryParams.append('SubjectGroupId', stepperState.selectedSubjectGroup.id.toString());
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
  saveTestSubmissions = this.actions$.pipe(
    ofType(StepperActions.SAVE_UNSAVE_TEST_SUBMISSIONS, StepperActions.SET_TEST_MARK),
    withLatestFrom(this.store.select('stepper'), this.store.select('auth')),
    switchMap(([actionData, stepperState, authState]) => {
      if (authState.user) {
        return this.http.post<Response<any>>(
          environment.apiUrl + 'api/v1/test-submission/saving',
          stepperState.unsaveTestSubmissions
        ).pipe(
          map((response) => {
            if (response.succeeded) {
              return new StepperActions.SaveUnsaveTestSubmissionsSuccess(response.succeeded);
            }
            return new StepperActions.HasErrors(response.errors);
          }),
          catchError((error) => {
            return of(new StepperActions.HasErrors([error.message]));
          })
        );
      }
      else {
        return of(new StepperActions.DoneLoading());
      }
    })
  );

  @Effect()
  caringAction = this.actions$.pipe(
    ofType(StepperActions.CARING_ACTION),
    withLatestFrom(this.store.select('stepper')),
    switchMap(([actionData, stepperState]) => {
      return this.http.post<Response<any>>(
        environment.apiUrl + 'api/v1/following-detail',
        new AddFollowingDetailParam(
          stepperState.selectedUniversityId,
          stepperState.selectedTrainingProgramId,
          stepperState.selectedMajor.id,
          stepperState.selectedSubjectGroup.id,
          new MarkParam(stepperState.marks, stepperState.followTranscriptTypeId, stepperState.gender, stepperState.provinceId),
          stepperState.followTranscriptTypeId == 3 ? stepperState.mockTestBasedUniversity.totalMark : stepperState.selectedSubjectGroup.totalMark
        )
      ).pipe(
        switchMap((response) => {
          if (response.succeeded) {
            return ([new StepperActions.CaringActionSuccess(), new StepperActions.LoadUniversities(
                        { 
                          subjectGroup: stepperState.selectedSubjectGroup,
                          major: stepperState.selectedMajor,
                          gender: stepperState.gender,
                          provinceId: stepperState.provinceId
                        }),
                        new StepperActions.LoadAfterMockTestsUniversities()
                      ]);
          }
          return of(new StepperActions.HasErrors(response.errors));
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
      return this.http.delete<Response<boolean>>(
        environment.apiUrl + 'api/v1/following-detail/' + stepperState.removeFollowingDetailId.toString()
      ).pipe(
        switchMap((response) => {
          if (response.succeeded) {
            return [new StepperActions.UncaringActionSuccess(), new StepperActions.LoadUniversities(
              {subjectGroup: stepperState.selectedSubjectGroup,
                major: stepperState.selectedMajor,
                gender: stepperState.gender,
                provinceId: stepperState.provinceId
              }
            ), new StepperActions.LoadAfterMockTestsUniversities()];
          }
          return of (new StepperActions.HasErrors(response.errors));
        }),
        catchError((error) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  loadUserSuggestion = this.actions$.pipe(
    ofType(StepperActions.LOAD_USER_SUGGESTION),
    switchMap(() => {
      return this.http.get<Response<UserSuggestionSubjectGroup>>(environment.apiUrl + 'api/v1/subject-group/top-subject-group')
      .pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetUserSuggestion(response.data);
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
  loadProvinces = this.actions$.pipe(
    ofType(StepperActions.LOAD_PROVINCES),
    switchMap(() => {
      return this.http.get<Response<Province[]>>(environment.apiUrl + 'api/v1/province')
      .pipe(
        map((response) => {
          if (response.succeeded) {
            return new StepperActions.SetProvinces(response.data);
          }
          return new StepperActions.HasErrors(response.errors);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new StepperActions.HasErrors([error.message]));
        })
      );
    }),
  );
}
