import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagedResponse } from 'src/app/_models/paged-response';
import { Response } from "src/app/_models/response";
import { Observable } from 'rxjs';
import { TestBySubject, TestDetail } from '../../view-models';

@Injectable({
  providedIn: 'root'
})
export class ExaminationService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;
  

  createNewExam(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/test', body);
  }

  updateExam(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/test/admin', body);
  }

  getListOfExam(pageNumber: number, pageSize: number, name: string, year: number, testTypeId: number, subjectId: number, order: number): Observable<PagedResponse<TestBySubject[]>> {
    console.log(pageSize, pageNumber, name, subjectId, order, testTypeId, year)
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`)
    if (year !== null) {
      console.log(params);
      params = params.append('Year', `${year}`);      
    }    
    if (name !== null) {
      params = params.append('Name', `${name}`);
      console.log(params);
    } 
    if (testTypeId !== null) {
      params = params.append('TestTypeId', `${testTypeId}`);
    }
    if (subjectId !== null) {
      params = params.append('SubjectId', `${subjectId}`);
    }
    if (order !== null) {
      params = params.append('Order', `${order}`);
    }
    return this._http.get<PagedResponse<TestBySubject[]>>(this.baseUrl + 'api/v1/test/admin-by-subject', { params });
  }

  getExamById(id: string): Observable<Response<TestDetail>> {
    return this._http.get<Response<TestDetail>>(this.baseUrl + 'api/v1/test/' + `${id}`);
  }

  setUpSuggestedTest(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/test/admin-suggest-test', body);
  }
}
