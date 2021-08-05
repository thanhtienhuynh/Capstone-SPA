import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedResponse } from 'src/app/_models/paged-response';
import { User } from 'src/app/_models/user';
import { Response } from "src/app/_models/response";

@Injectable({
  providedIn: 'root'
})
export class UserConfigurationService {

  constructor(
    private _http: HttpClient
  ) { }

  baseUrl = environment.apiUrl;

  getListOfUser(pageNumber: number, pageSize: number, fullName: string, email: string, role: number, isActive: number): Observable<PagedResponse<User[]>> {    
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`)
    if (fullName !== null) {      
      params = params.append('Fullname', `${fullName}`);      
    }    
    if (email !== null) {
      params = params.append('Email', `${email}`);      
    } 
    if (role !== null) {
      params = params.append('Role', `${role}`);
    }
    if (isActive !== null) {
      params = params.append('IsActive', `${isActive}`);
    }
    return this._http.get<PagedResponse<User[]>>(this.baseUrl + 'api/v1/user', { params });
  }

  updateUser(body: any): Observable<Response<any>> {    
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/user', body);
  }
  
}
