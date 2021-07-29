import { Component, OnDestroy, OnInit, } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Subscription } from "rxjs";
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, BoardData, } from 'src/app/admin/view-models';
import {MediaObserver, MediaChange} from '@angular/flex-layout';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-article',
  templateUrl: './top-article.component.html',
  styleUrls: ['./top-article.component.scss']
})
export class TopArticleComponent implements OnInit, OnDestroy {

  unFilterArticles: ArticleVM[] = [];
  publishedArticles: ArticleVM[] = []; 
  topArticles: ArticleVM[] = [];  

  mediaSub:Subscription;

  constructor(
    private _articleService: ArticleService,
    public mediaObserver: MediaObserver
  ) { }

  ngOnDestroy(): void {
    // this.mediaSub.unsubscribe();
  }

  ngOnInit() {    
    this.reset();
    this.getListOfTopArticle();
    this.getPublishedArticle(1, 10, 3);
  }

  reset(): void {
    this.publishedArticles = [];
    this.topArticles = [];
  }

  getPublishedArticle(pageNumber: number, pageSize: number, status: number): void {
    this._articleService.getListOfArticle(pageNumber, pageSize, status).pipe(
      // map(rs => rs.succeeded === true ? this.listOfPublishedArticle = rs.data?.filter(sj => sj.id !== this.listOfTopArticle.find(top => top.id === sj.id)?.id) : this.listOfPublishedArticle = [])
      // tap((rs) => {
      //   if (rs.succeeded === true) {
      //     this.totalRecords = rs.totalRecords;
      //   }
      // }),
      map((rs) => {
        // console.log('Danh sách chưa lọc', rs.data);
        if (rs.succeeded === true) {
          this.unFilterArticles = rs.data;
          if (rs.data !== null) {
            this.publishedArticles = rs.data?.filter(sj => sj.id !== this.topArticles?.find(top => top.id === sj.id)?.id);
          } else {
            this.publishedArticles = [];
          }
        } else {
          this.publishedArticles = [];
        }
      })
    ).subscribe();
  }

  getListOfTopArticle(topRecord?: number): void {
    this._articleService.getListOfTopArticle(topRecord).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.topArticles = rs.data
          } else {
            this.topArticles = [];
          }
        }
      })
    ).subscribe();
  }





  reloadLaneData(event: BoardData): void {    
    if (!event) {
      return;
    }
    if (!event.publisedData) {
      if (event.topData.length !== 0) {
        this.publishedArticles = [...this.publishedArticles];
        this.topArticles = [...event.topData];
        return;
      }
      this.topArticles = [...event.topData];
      this.publishedArticles = [...this.unFilterArticles];
      return;
    }
    this.publishedArticles = [...event.publisedData];
    this.topArticles = [...event.topData];
  }

  submitData(event: BoardData): void {
    if (!event) {
      return;
    }
    const data = event.topData.map(rs => rs.id);
    this.updateTopArticle(data)
  }

  searchByTitle(event: BoardData): void {
    if (!event) {
      return;
    };
    if (event.publisedData !== undefined) {
      this.publishedArticles = [...event.publisedData?.filter(sj => sj.id !== this.topArticles?.find(top => top.id === sj.id)?.id)];
      return;
    }    
    this.publishedArticles = [...this.unFilterArticles?.filter(sj => sj.id !== this.topArticles?.find(top => top.id === sj.id)?.id)];   
  }

  updateTopArticle(data: (string | number)[]): void {
    this._articleService.updateTopArticle(data).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {                       
            Swal.fire('Thành Công', 'Thiết lập thành công', 'success');
            this.getListOfTopArticle();
            this.getPublishedArticle(1, 10, 3);
          } else {            
            this.getListOfTopArticle();
            this.getPublishedArticle(1, 10, 3);
          }
        } else {
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
          this.getListOfTopArticle();
          this.getPublishedArticle(1, 10, 3);
        }
      })
    ).subscribe()
  }
}
