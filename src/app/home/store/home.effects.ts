import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { CollapseArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { PagedResponse } from "src/app/_models/paged-response";
import { Response } from "src/app/_models/response";
import { Test } from "src/app/_models/test";
import { TestSubmission } from "src/app/_models/test-submission";
import { CusUniversity, CusUniversityMajorDetail, UniSeason } from "src/app/_models/university";
import { environment } from "src/environments/environment";
import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../store/home.actions';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  @Effect()
  loadCollapseArticles = this.actions$.pipe(
    ofType(HomeActions.LOAD_COLLAPSE_ARTICLES),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState] : [HomeActions.LoadCollapseArticles, {}]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageNumber', actionData.payload.pageNumber.toString());
      queryParams = queryParams.append('pageSize', actionData.payload.pageSize.toString());
      return this.http.get<PagedResponse<CollapseArticle[]>>(environment.apiUrl + 'api/v1/article/all',
        {
          params: queryParams
        }
      ).pipe(
        map((collapseArticles) => {
          if (collapseArticles.succeeded) {
            return new HomeActions.SetCollapseArticles(collapseArticles);
          }
          return new HomeActions.HasErrors(collapseArticles.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );


  @Effect()
  loadDetailArticle = this.actions$.pipe(
    ofType(HomeActions.LOAD_DETAIL_ARTICLE),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      return this.http.get<Response<DetailArticle>>(environment.apiUrl + 'api/v1/article/detail/' + homeState.selectedArticleId
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetDetailArticle(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  loadTopArticle = this.actions$.pipe(
    ofType(HomeActions.LOAD_TOP_ARTICLES),
    switchMap((actionData) => {
      return this.http.get<Response<CollapseArticle[]>>(environment.apiUrl + 'api/v1/article/admin-top'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetTopArticles(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  loadCollapseTests = this.actions$.pipe(
    ofType(HomeActions.LOAD_COLLAPSE_TESTS),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState] : [HomeActions.LoadCollapseTests, {}]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageNumber', actionData.payload.pageParam.pageNumber.toString());
      queryParams = queryParams.append('pageSize', actionData.payload.pageParam.pageSize.toString());
      queryParams = queryParams.append('subjectId', actionData.payload.subjectId.toString());
      if (actionData.payload.searchTerm) {
        queryParams = queryParams.append('name', actionData.payload.searchTerm);
      }
      return this.http.get<PagedResponse<Test[]>>(environment.apiUrl + 'api/v1/test/user-by-subject',
        {
          params: queryParams
        }
      ).pipe(
        map((collapseTests) => {
          if (collapseTests.succeeded) {
            return new HomeActions.SetCollapseTests(collapseTests);
          }
          return new HomeActions.HasErrors(collapseTests.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  loadSelectedTest = this.actions$.pipe(
    ofType(HomeActions.LOAD_DETAIL_TEST),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      return this.http.get<Response<Test>>(
        environment.apiUrl + 'api/v1/test/' + homeState.selectedTestId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetDetailTest(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  scoringTest = this.actions$.pipe(
    ofType(HomeActions.SCORING_TEST),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      return this.http.post<Response<TestSubmission>>(
        environment.apiUrl + 'api/v1/test-submission', homeState.testSubmissionParam
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetTestMark(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadUniversities = this.actions$.pipe(
    ofType(HomeActions.LOAD_UNIVERSITIES),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState] : [HomeActions.LoadUniversities, {}]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageNumber', actionData.payload.pageParam.pageNumber.toString());
      queryParams = queryParams.append('pageSize', actionData.payload.pageParam.pageSize.toString());
      if (actionData.payload.order) {
        queryParams = queryParams.append('order', actionData.payload.order.toString());
      }
      if (actionData.payload.searchTerm) {
        queryParams = queryParams.append('name', actionData.payload.searchTerm);
      }
      return this.http.get<PagedResponse<CusUniversity[]>>(environment.apiUrl + 'api/v1/university/all',
        {
          params: queryParams
        }
      ).pipe(
        map((universities) => {
          if (universities.succeeded) {
            return new HomeActions.SetUniversities(universities);
          }
          return new HomeActions.HasErrors(universities.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );

  @Effect()
  loadUniversity = this.actions$.pipe(
    ofType(HomeActions.LOAD_UNIVERSITY),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      return this.http.get<Response<CusUniversity>>(
        environment.apiUrl + 'api/v1/university/detail/' + homeState.selectedUniversityId.toString()
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetUniversity(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadUniversityMajorDetails = this.actions$.pipe(
    ofType(HomeActions.LOAD_UNIVERSITY_MAJOR_DETAIL),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageNumber', homeState.cusMajorDetailPageFilter.pageNumber.toString());
      queryParams = queryParams.append('pageSize', homeState.cusMajorDetailPageFilter.pageSize.toString());
      queryParams = queryParams.append('universityId', homeState.majorDetailFilter.universityId.toString());
      if (homeState.majorDetailFilter.majorCode) {
        queryParams = queryParams.append('majorCode', homeState.majorDetailFilter.majorCode);
      }
      if (homeState.majorDetailFilter.majorName) {
        queryParams = queryParams.append('majorName', homeState.majorDetailFilter.majorName);
      }
      if (homeState.majorDetailFilter.seasonId) {
        queryParams = queryParams.append('seasonId', homeState.majorDetailFilter.seasonId.toString());
      }
      if (homeState.majorDetailFilter.order) {
        queryParams = queryParams.append('order', homeState.majorDetailFilter.order.toString());
      }
      return this.http.get<PagedResponse<CusUniversityMajorDetail[]>>(
        environment.apiUrl + 'api/v1/university/major-detail/',
        {
          params: queryParams
        }
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetUniversityMajorDetail(response);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    })
  );

  @Effect()
  loadSeasons = this.actions$.pipe(
    ofType(HomeActions.LOAD_SEASONS),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      return this.http.get<Response<UniSeason[]>>(
        environment.apiUrl + 'api/v1/season/'
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetSeasons(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    })
  );
}