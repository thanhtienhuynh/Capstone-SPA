import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
    this.excludedUrlsRegex =
      this.excludedUrls.map(urlPattern => new RegExp(urlPattern, 'i')) || [];
  }

  private excludedUrlsRegex: RegExp[];
  private excludedUrls = [ ".svg" ]; 

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const userLogin = localStorage.getItem('token');
    let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IlRp4bq_biBIdeG7s25oIFRoYW5oIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbW9iaWxlcGhvbmUiOiIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy91cmkiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLS1aUmVBZ3ItV1dnL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y2xEblZRbEQ0OUQ0UUV5Qko3N1VwVnBSV25qM2cvczk2LWMvcGhvdG8uanBnIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGllbmh0c2UxMzA1NTBAZnB0LmVkdS52biIsImp0aSI6IjE1YTkwZThjLWU4NTctNDdlZi1iNDU0LTgwOGQ0OTJhZmNhMCIsImV4cCI6MTYyMDM2MTYyOCwiaXNzIjoiY2Fwc3RvbmUtYXBpLXNlcnZlciIsImF1ZCI6ImNhcHN0b25lLWNsaWVudCJ9.lQYpjenBLndWxrtKorg5DOIdKBthIJD-0i8KYckERBg';
    const passThrough: boolean = 
      !!this.excludedUrlsRegex.find(regex => regex.test(request.url));
    // if (userLogin) {
    //   accessToken = userLogin;
    // }    
    if (passThrough) {
      return next.handle(request);
    }
    const req = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken}`,
      ),
    });
    return next.handle(req); 
  }
}
