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


  // getUsers( pageIndex: number,pageSize: number,sortField: string | null,sortOrder: string | null,filters: Array<{ key: string; value: string[] }>): Observable<{ results: RandomUser[] }> {
  //   let params = new HttpParams()
  //     .append('page', `${pageIndex}`)
  //     .append('results', `${pageSize}`)
  //     .append('sortField', `${sortField}`)
  //     .append('sortOrder', `${sortOrder}`);
  //   filters.forEach(filter => {
  //     filter.value.forEach(value => {
  //       params = params.append(filter.key, value);
  //     });
  //   });
  //   return this.http.get<{ results: RandomUser[] }>(`${this.randomUserUrl}`, { params });
  // }
  baseUrl = environment.apiUrl;

  getListOfArticle(pageSize: number, pageNumber: number): Observable<PagedResponse<ArticleVM[]>>{
    let params = new HttpParams().append('PageNumber', `${pageSize}`).append('PageSize', `${pageNumber}`);
    return this._http.get<PagedResponse<ArticleVM[]>>(this.baseUrl + 'api/v1/article/admin-all', { params});
  }

  getArticleById(id: string): Observable<Response<ArticleVM>>{
    return this._http.get<PagedResponse<ArticleVM>>(this.baseUrl + 'api/v1/article/admin-detail/' + + `${id}`);
  }
}
