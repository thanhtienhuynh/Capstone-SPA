import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagedResponse } from 'src/app/_models/paged-response';
import { Response } from "src/app/_models/response";
import { Subject } from '../../view-models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getListOfSubject(): Observable<Response<Subject[]>> {        
    return this._http.get<PagedResponse<Subject[]>>(this.baseUrl + 'api/v1/subject');
  }

}
