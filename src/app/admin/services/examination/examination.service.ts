import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagedResponse } from 'src/app/_models/paged-response';
import { Response } from "src/app/_models/response";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExaminationService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;
  

  createNewExam(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/test', body);
  }

  updateMajorToSystem(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/major/subject-weight2', body);
  }

}
