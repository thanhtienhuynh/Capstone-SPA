import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MajorSubjectGroup, UniversityRM } from '../../view-models';
import { Response } from "src/app/_models/response";
import { PagedResponse } from 'src/app/_models/paged-response';


@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  createUniversity(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/university', body);
  }

  getAllUniversity(): Observable<PagedResponse<any>> {
    return this._http.get<PagedResponse<any>>(this.baseUrl + 'api/v1/university');
  }

  getListOfUniversity(pageNumber: number, pageSize: number, name: string, status: string): Observable<PagedResponse<any>> {
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`).append('Name', `${name}`).append('Status', `${status}`);
    return this._http.get<PagedResponse<any>>(this.baseUrl + 'api/v1/university/admin-all', { params });
  }
  getUniversityById(id: string): Observable<Response<any>> {
    return this._http.get<Response<any>>(this.baseUrl + 'api/v1/university/detail/' + `${id}`);
  }

  updateUniversity(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/university', body);
  }

  //DB Mới
  getMajorOfUniversity(pageNumber: number, pageSize: number, uniId: string, seasonId: number, majorName: string): Observable<PagedResponse<any>> {
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`).append('UniversityId', `${uniId}`).append('SeasonId', `${seasonId}`).append('MajorName', `${majorName}`);
    return this._http.get<PagedResponse<any>>(this.baseUrl + 'api/v1/university/major-detail', { params });
  }

  majorAddition(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/university/major-addition', body);
  }

  majorUpdation(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/university/major-updation', body);
  }
  majorSubjectGroup(majorId: number): Observable<Response<MajorSubjectGroup[]>> {
    let params = new HttpParams().append('MajorId', `${majorId}`);
    return this._http.get<Response<MajorSubjectGroup[]>>(this.baseUrl + 'api/v1/major-subject-group', { params });
  }
}

