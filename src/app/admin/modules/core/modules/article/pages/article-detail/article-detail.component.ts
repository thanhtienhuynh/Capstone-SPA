import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM } from 'src/app/admin/view-models';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    private _articleService: ArticleService
  ) { 

  }

  article: ArticleVM = {
    content: '<nz-skeleton [nzActive]="true"></nz-skeleton>'
  };
  ngOnInit() {
    this.getArticleById();
  }

  useUpdate(): void {    
    this.router.navigate(['admin/core/article/details/3']);      
  }

  getArticleById(): void {
    this.activatedRoute.params.subscribe((param) => {
      this._articleService.getArticleById(param.id).pipe(
        tap((rs) => {
          if (rs.succeeded === true) {
            this.article = rs.data;  
          } else {
            this.article = null;
          }     
        }),
        catchError((err) => {
          this.article = null;
          return of(undefined);
        })
      ).subscribe();      
    });
  }
}
