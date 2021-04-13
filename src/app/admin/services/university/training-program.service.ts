import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {

  constructor(private _http: HttpClient) { }  

  baseUrl = environment.apiUrl;

  getAllTrainingProgram(): Observable<any> {
    return this._http.get<any>(this.baseUrl + 'api/v1/trainingprogram');
  }
}
