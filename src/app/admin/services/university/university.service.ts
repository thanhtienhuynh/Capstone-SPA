import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UniversityRM } from '../../view-models';
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

  getAllUniversity(): Observable<PagedResponse<any>>{
    return this._http.get<PagedResponse<any>>(this.baseUrl + 'api/v1/university');
  }

  getUniversityById(id: string): Observable<Response<any>>{
    return this._http.get<Response<any>>(this.baseUrl + 'api/v1/university/detail/' + `${id}`);
  }

  updateUniversity(body: any): Observable<Response<any>>{
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/university', body);
  }
}
