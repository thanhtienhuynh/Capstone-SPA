import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from 'src/app/_models/response';
import { environment } from 'src/environments/environment';
import { Province } from '../../view-models';

@Injectable({
  providedIn: 'root'
})
export class AdmissionMethodService {
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getAddmissionMethod(): Observable<Response<any>> {    
    return this._http.get<Response<any>>(this.baseUrl + 'api/v1/admission-method');
  }

  getProvince(): Observable<Response<Province[]>> {    
    return this._http.get<Response<Province[]>>(this.baseUrl + 'api/v1/province');
  }
}
