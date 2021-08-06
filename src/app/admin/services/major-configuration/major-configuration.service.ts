import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedResponse } from 'src/app/_models/paged-response';
import { Response } from "src/app/_models/response";
import { MajorConfiguration } from '../../view-models';
@Injectable({
  providedIn: 'root'
})
export class MajorConfigurationService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  // getAddmissionMethod(): Observable<Response<any>> {    
  //   return this._http.get<Response<any>>(this.baseUrl + 'api/v1/admission-method');
  // }
  getListOfSubjectWeightNonePaging(majorName: string): Observable<PagedResponse<MajorConfiguration[]>> {  
    let params = new HttpParams().append('majorName', `${majorName}`);  
    return this._http.get<PagedResponse<MajorConfiguration[]>>(this.baseUrl + 'api/v1/major/subject-weight');
  }

  getListOfSubjectWeight(pageNumber: number, pageSize: number, majorName: string): Observable<PagedResponse<MajorConfiguration[]>> {
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`).append('majorName', `${majorName}`);
    return this._http.get<PagedResponse<MajorConfiguration[]>>(this.baseUrl + 'api/v1/major/subject-weight', { params });
  }

  getMajorById(id: number): Observable<PagedResponse<MajorConfiguration>> {    
    return this._http.get<PagedResponse<MajorConfiguration>>(this.baseUrl + 'api/v1/major/subject-weight/' +  `${id}`);
  }
  addNewMajorToSystem(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/major/subject-weight', body);
  }

  updateMajorToSystem(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/major/subject-weight2', body);
  }
}
