import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UniversityRM } from '../../view-models';


@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  createUniversity(body: any): Observable<any> {
    return this._http.post<any>(this.baseUrl + 'api/v1/university', body);
  }

  getAllUniversity(): Observable<any>{
    return this._http.get(this.baseUrl + 'api/v1/university');
  }

  getUniversityById(id: string): Observable<any>{
    return this._http.get(this.baseUrl + 'api/v1/university/detail/' + `${id}`);
  }

  updateUniversity(body: any): Observable<any>{
    return this._http.put<any>(this.baseUrl + 'api/v1/university', body);
  }
}
