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
    const userLogin = localStorage.getItem('token');
    let accessToken = null;
    const passThrough: boolean = 
      !!this.excludedUrlsRegex.find(regex => regex.test(request.url));
    if (userLogin) {
       accessToken = userLogin;
    }    
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
