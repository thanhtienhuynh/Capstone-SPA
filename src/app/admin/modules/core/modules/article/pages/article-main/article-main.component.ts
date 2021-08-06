import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbTabComponent } from '@nebular/theme';
import { tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, MajorRM, PageModel } from 'src/app/admin/view-models';
import { ArticleGridListComponent, TopArticleComponent } from '../../components';

@Component({
  selector: 'app-article-main',
  templateUrl: './article-main.component.html',
  styleUrls: ['./article-main.component.scss']
})
export class ArticleMainComponent implements OnInit {

  @ViewChild('topArticle') topArticle: TopArticleComponent;

  @ViewChild('gridOne') gridOne: ArticleGridListComponent;
  @ViewChild('gridTwo') gridTwo: ArticleGridListComponent;
  @ViewChild('gridThree') gridThree: ArticleGridListComponent;
  @ViewChild('gridFour') gridFour: ArticleGridListComponent;
  @ViewChild('gridFive') gridFive: ArticleGridListComponent;

  listOfArticle: ArticleVM[];
  totalArticleRecords: number;

  isLoadingArticle: boolean = false;

  constructor(
    private _articleService: ArticleService,
    protected readonly router: Router,
  ) { }

  ngOnInit() { }


  getListOfArticle(pageNumber: number, pageSize: number, status: number): void {
    this.isLoadingArticle = true;
    this._articleService.getListOfArticle(pageNumber, pageSize, status).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null && rs.data?.length !== 0) {      
            this.isLoadingArticle = false;      
            this.totalArticleRecords = rs.totalRecords;
            this.listOfArticle = rs.data;
          } else {
            this.isLoadingArticle = false;
            this.totalArticleRecords = 0
            this.listOfArticle = [];
          }
        } else {
          this.isLoadingArticle = false;
          this.totalArticleRecords = 0
          this.listOfArticle = [];
        }
      })
    ).subscribe();
  }

  getListOfArticleByTitle(pageNumber: number, pageSize: number, status: number, title: string): void {
    this.isLoadingArticle = true;
    this._articleService.searchByTitle(pageNumber, pageSize, status, title).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null && rs.data?.length !== 0) {  
            this.isLoadingArticle = false;          
            this.totalArticleRecords = rs.totalRecords;
            this.listOfArticle = rs.data;
          } else {
            this.isLoadingArticle = false;
            this.totalArticleRecords = 0;
            this.listOfArticle = [];
          }
        } else {
          this.totalArticleRecords = 0;
          this.listOfArticle = [];
        }
      })
    ).subscribe();
  }

  onRedirect(): void {
    this.router.navigate['admin/core/article/censor']
  }

  searchByTitle(event: any): void {
    this.listOfArticle = [];
    if (event.title === "") {
      this.getListOfArticle(1, 8, event.status);
    } else {
      this.getListOfArticleByTitle(1, 8, event.status, event.title);
    }
  }


  changeTab(event: NbTabComponent) {
    if (event.tabTitle === "bài viết được đăng") {
      this.topArticle.ngOnInit();
    }
    if (event.tabTitle === "bài viết đã duyệt") {
      this.listOfArticle = undefined;
      this.getListOfArticle(1, 8, 1);
      this.gridOne.resetPageModel();
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
      this.gridFour.resetPageModel();
      this.gridFive.resetPageModel();
    }
    if (event.tabTitle === "bài viết chờ duyệt") {
      this.listOfArticle = undefined;
      this.getListOfArticle(1, 8, 0);
      this.gridOne.resetPageModel();
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
      this.gridFour.resetPageModel();
      this.gridFive.resetPageModel();
    }
    if (event.tabTitle === "bài viết bị chặn") {
      this.listOfArticle = undefined;
      this.getListOfArticle(1, 8, 2);
      this.gridOne.resetPageModel();
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
      this.gridFour.resetPageModel();
      this.gridFive.resetPageModel();
    }
    if (event.tabTitle === "bài viết quá hạn") {
      this.listOfArticle = undefined;
      this.getListOfArticle(1, 8, 4);
      this.gridOne.resetPageModel();
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
      this.gridFour.resetPageModel();
      this.gridFive.resetPageModel();
    }
    if (event.tabTitle === "xem xét") {
      this.listOfArticle = undefined;
      this.getListOfArticle(1, 8, 5);
      this.gridOne.resetPageModel();
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
      this.gridFour.resetPageModel();
      this.gridFive.resetPageModel();
    }
  }

  pagination(event: PageModel): void {
    this.listOfArticle = [];
    this.getListOfArticle(event.pageNumber, event.pageSize, event.status);
  }

}
