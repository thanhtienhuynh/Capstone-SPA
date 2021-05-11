import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/_models/response';
@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {

  constructor(private _http: HttpClient) { }  

  baseUrl = environment.apiUrl;

  getAllTrainingProgram(): Observable<Response<any>> {
    return this._http.get<Response<any>>(this.baseUrl + 'api/v1/trainingprogram');
  }
}
