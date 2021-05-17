import { Component, OnInit, ViewChild } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, PageModel } from 'src/app/admin/view-models';
import { BoardArticleListComponent } from '../board-article-list/board-article-list.component';

@Component({
  selector: 'app-top-article',
  templateUrl: './top-article.component.html',
  styleUrls: ['./top-article.component.scss']
})
export class TopArticleComponent implements OnInit {

  @ViewChild('listZero') listZero: BoardArticleListComponent;


  listOfPublishedArticle: ArticleVM[];
  listOfTopArticle: ArticleVM[];
  totalArticleRecords: number = 20;
  constructor(
    private _articleService: ArticleService,
  ) { }

  ngOnInit() { 
    this.reset();       
    this.getListOfTopArticle();
    this.getPublishedArticle(1, 10, 3);    
  }

  reset(): void {
    this.listZero?.resetPageModel();
    this.listOfPublishedArticle = [];
    this.listOfTopArticle = [];
  }

  getPublishedArticle(pageSize: number, pageNumber: number, status: number): void {
    this._articleService.getListOfArticle(pageSize, pageNumber, status).pipe(          
      map(rs => rs.succeeded === true ? this.listOfPublishedArticle = rs.data.filter(sj => sj.id !== this.listOfTopArticle.find(top => top.id === sj.id)?.id) : this.listOfPublishedArticle = [])      
    ).subscribe();
  }

  getListOfTopArticle(topRecord?:number): void {
    this._articleService.getListOfTopArticle(topRecord).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          this.listOfTopArticle = rs.data          
        }
      })
    ).subscribe();
  } 

  onChangeTitleValue(event: string): void {
    this._articleService.searchByTitle(1, 10, 3, event).pipe(
      tap(rs => {
        if (rs.succeeded === true) {          
          this.listOfPublishedArticle = rs.data;
        }
      })
    ).subscribe();    
  }  

  pagination(event: PageModel): void {           
    this.getPublishedArticle(event.pageNumber, event.pageSize, event.status);    
  }
}
