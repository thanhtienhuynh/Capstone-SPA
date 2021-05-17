import { Component, OnInit, ViewChild } from '@angular/core';
import { isThisSecond } from 'date-fns';
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
  totalRecords: number;

  searchTitleValue: string = '';
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
      // map(rs => rs.succeeded === true ? this.listOfPublishedArticle = rs.data?.filter(sj => sj.id !== this.listOfTopArticle.find(top => top.id === sj.id)?.id) : this.listOfPublishedArticle = [])
      // tap((rs) => {
      //   if (rs.succeeded === true) {
      //     this.totalRecords = rs.totalRecords;
      //   }
      // }),
      map((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.totalRecords = rs.totalRecords;
            this.listOfPublishedArticle = rs.data?.filter(sj => sj.id !== this.listOfTopArticle.find(top => top.id === sj.id)?.id);
          } else {
            this.listOfPublishedArticle = [];
          }
        } else {
          this.listOfPublishedArticle = [];
        }
      })      
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

  searchByTitle(pageNumber:number, pageSize:number, status:number, title:string): void {
    this._articleService.searchByTitle(pageNumber, pageSize, status, title).pipe(      
      map((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.totalRecords = rs.totalRecords;
            this.listOfPublishedArticle = rs.data?.filter(sj => sj.id !== this.listOfTopArticle.find(top => top.id === sj.id)?.id);
          } else {
            this.listOfPublishedArticle = [];
          }
        } else {
          this.listOfPublishedArticle = [];
        }
      })
    ).subscribe();
  }

  onChangeTitleValue(event: string): void {
    this.searchTitleValue = event;
    this.listZero?.resetPageModel();
    this.searchByTitle(1, 10, 3, event);
  }  

  initPageSize: number = 10;
  initPageNumber: number = 1;

  pagination(event: PageModel): void {   
    // console.log(event);    
    // this.initPageSize = event.pageNumber;
    // this.initPageNumber = event.pageSize;
    if (this.searchTitleValue !== '') {
      this.listZero?.resetPageModel();
      this.searchByTitle(event.pageNumber, event.pageSize, event.status, this.searchTitleValue);
    } else {
      this.listZero?.resetPageModel();
      this.searchByTitle(event.pageNumber, event.pageSize, event.status, '');
    }    
    // this.getPublishedArticle(event.pageNumber, event.pageSize, event.status);    
  }
}
