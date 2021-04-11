import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectGroupService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getAllSubjectGroup(): Observable<any>{
    return this._http.get(this.baseUrl + 'api/v1/subject-group');
  }  
}
