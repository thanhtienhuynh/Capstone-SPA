import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from 'src/app/_models/response';
import { PagedResponse } from 'src/app/_models/paged-response';
import { environment } from 'src/environments/environment';
import { ArticleVM } from '../../view-models';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private _http: HttpClient
  ) { }

  baseUrl = environment.apiUrl;


  crawlArticle(body: any): Observable<PagedResponse<any>> {
    return this._http.post<PagedResponse<any>>(this.baseUrl + 'api/v1/crawler/article', body);
  }

  getListOfArticle(pageNumber: number, pageSize: number, status: number): Observable<PagedResponse<ArticleVM[]>> {
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`).append('Status', `${status}`);
    return this._http.get<PagedResponse<ArticleVM[]>>(this.baseUrl + 'api/v1/article/admin-all', { params });
  }

  searchByTitle(pageNumber: number, pageSize: number, status: number, title: string): Observable<PagedResponse<ArticleVM[]>> {
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`).append('Status', `${status}`).append('Search', `${title}`);
    return this._http.get<PagedResponse<ArticleVM[]>>(this.baseUrl + 'api/v1/article/admin-all', { params });
  }

  searchByCondition(pageNumber: number, pageSize: number, status: number, title: string): Observable<PagedResponse<ArticleVM[]>> {
    let params = new HttpParams().append('PageSize', `${pageSize}`).append('PageNumber', `${pageNumber}`).append('Status', `${status}`).append('Search', `${title}`);
    return this._http.get<PagedResponse<ArticleVM[]>>(this.baseUrl + 'api/v1/article/admin-all', { params });
  }

  getListOfTopArticle(topRecord?: number): Observable<PagedResponse<ArticleVM[]>> {
    return this._http.get<PagedResponse<ArticleVM[]>>(this.baseUrl + 'api/v1/article/admin-top');
  }

  updateTopArticle(body: any): Observable<Response<ArticleVM[]>> {
    return this._http.put<Response<ArticleVM[]>>(this.baseUrl + 'api/v1/article/top', body);
  }
  getArticleById(id: string | number): Observable<Response<ArticleVM>> {
    return this._http.get<PagedResponse<ArticleVM>>(this.baseUrl + 'api/v1/article/admin-detail/' + + `${id}`);
  }

  getUnApprovedArticleIdList(): Observable<Response<number[]>> {
    return this._http.get<Response<number[]>>(this.baseUrl + 'api/v1/article/admin-unapproved-articles');
  }

  getApprovedArticleList(): Observable<Response<number[]>> {
    return this._http.get<Response<number[]>>(this.baseUrl + 'api/v1/article/approved-article-ids');
  }
  confirmArticle(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/article', body);
  }

  createArticle(body: any): Observable<Response<any>> {
    return this._http.post<Response<any>>(this.baseUrl + 'api/v1/article', body);
  }

  updateArticle(body: any): Observable<Response<any>> {
    return this._http.put<Response<any>>(this.baseUrl + 'api/v1/article/update-article', body);
  }

}
