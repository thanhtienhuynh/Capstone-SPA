import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Season } from '../../view-models';
import { Response } from "src/app/_models/response";
import { PagedResponse } from 'src/app/_models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getListOfSeason(): Observable<Response<Season[]>> {
    return this._http.get<PagedResponse<Season[]>>(this.baseUrl + 'api/v1/season');
  }  

  createSeason(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/season', body);
  } 

  updateSeason(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/season', body);
  } 

}
