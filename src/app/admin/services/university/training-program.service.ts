import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {

  constructor(private _http: HttpClient) { }  

  getAllTrainingProgram(): Observable<any> {
    return this._http.get<any>('https://localhost:44344/api/v1/trainingprogram');
  }
}
