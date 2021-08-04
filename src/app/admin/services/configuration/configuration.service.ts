import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponse } from 'src/app/_models/paged-response';
import { Response } from "src/app/_models/response";
import { environment } from 'src/environments/environment';
import { ConfigurationRM, PagingConfiguration } from '../../view-models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getConfigApp(): Observable<Response<ConfigurationRM>> {
    return this._http.get<Response<ConfigurationRM>>(this.baseUrl + 'api/v1/configuration/app');
  }

  getConfigPaging(): Observable<Response<PagingConfiguration>> {
    return this._http.get<Response<PagingConfiguration>>(this.baseUrl + 'api/v1/configuration/pagination');
  }  

  updateConfigPaging(body: PagingConfiguration): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/configuration/pagination', body);
  }

  updateConfigApp(body: ConfigurationRM): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/configuration/app', body);
  }
}
