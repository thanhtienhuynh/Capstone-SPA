import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UniversityRM } from '../../view-models';


@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(private _http: HttpClient) { }

  createUniversity(body: UniversityRM): Observable<any> {
    return this._http.post<any>('', body);
  }
}
