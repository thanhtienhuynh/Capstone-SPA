import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM } from 'src/app/admin/view-models';

@Component({
  selector: 'app-article-content-modal',
  templateUrl: './article-content-modal.component.html',
  styleUrls: ['./article-content-modal.component.scss']
})
export class ArticleContentModalComponent implements OnInit, OnChanges {

  @Input() articleId: string | number;
  article: ArticleVM;
  constructor(
    private _articleService: ArticleService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.article);
  }

  
  ngOnInit() {
    this.getArticleById(this.articleId);
    console.log(this.article);
  }


  getArticleById(id: string | number): void {
    this._articleService.getArticleById(id).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          console.log(rs.data);          
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
  }
}
