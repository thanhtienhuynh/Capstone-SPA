import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/_models/response';
import { SubjectGroupVM, SubjectPerSubjectGroup } from '../../view-models';
@Injectable({
  providedIn: 'root'
})
export class SubjectGroupService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getAllSubjectGroup(): Observable<Response<SubjectGroupVM[]>>{
    return this._http.get<Response<SubjectGroupVM[]>>(this.baseUrl + 'api/v1/subject-group');
  }  

  getSubjectsBySubjectGroupId(id: number): Observable<Response<SubjectPerSubjectGroup>>{
    let params = new HttpParams().append('id', `${id}`);
    return this._http.get<Response<SubjectPerSubjectGroup>>(this.baseUrl + 'api/v1/subject-group/' + `${id}`);
  }
}
