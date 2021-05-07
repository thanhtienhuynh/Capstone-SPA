import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from "src/app/_models/response";
@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(private _http: HttpClient) { }

  baseUrl = environment.apiUrl;

  createMajor(body: any): Observable<any> {    
    return this._http.post<any>(this.baseUrl + 'api/v1/university/major-addition', body);
  }

  getAllMajor(): Observable<any>{
    return this._http.get(this.baseUrl + 'api/v1/major');
  }

  getUniversityById(id: string): Observable<any>{
    return this._http.get(this.baseUrl + 'api/v1/university/detail/' + `${id}`);
  }

  updateMajor(body: any): Observable<any>{
    return this._http.put<any>(this.baseUrl + 'api/v1/university/major-updation', body);
  }

  addNewMajorSystem(body: any): Observable<any>{
    return this._http.post(this.baseUrl + 'api/v1/major', body);
  }

  getAllTrainingProgram(): Observable<any> {
    return this._http.get<any>(this.baseUrl + 'api/v1/trainingprogram');
  }
}
