import { HttpClient } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private http: HttpClient) {
    super();
  }

  handleError(error) {
    console.log(error);
    this.http.post(environment.apiUrl + 'api/v1/logger', 
      {
        message: error.stack
      }
    ).subscribe((res) => {});
  }
}