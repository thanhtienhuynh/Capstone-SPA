import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbTabComponent } from '@nebular/theme';
import { tap } from 'rxjs/operators';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, MajorRM, PageModel } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';
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

  listOfArticle: ArticleVM[]; 
  totalArticleRecords: number;

  listOfUniversity: University[];
  listOfDisplayUniversity: University[] = [];  
  listOfSelectedUniversity = [];

  listOfMajor: MajorRM[];
  listOfDisplayMajor: MajorRM[]=[];
  listOfSelectedMajor = [];

  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];

  constructor(
    private _articleService: ArticleService,
    protected readonly router: Router,
    private _universityService: UniversityService,
    private _majorService: MajorService,
  ) { }

  ngOnInit() {    
    this.getListOfUniversity();
    this.getListOfMajor();
  }

  
  getListOfArticle(pageNumber: number, pageSize: number, status: number): void {
    this._articleService.getListOfArticle(pageNumber, pageSize, status).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {  
          this.totalArticleRecords = rs.totalRecords;                  
          this.listOfArticle = rs.data;                                     
        } else {
          
        }
      })
    ).subscribe();
  }

  getListOfUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {        
        this.listOfUniversity = rs.data
        this.listOfDisplayUniversity = rs.data
      })
    ).subscribe();    
  }

  getListOfMajor(): void {
    this._majorService.getAllMajor().pipe(
      tap((rs) => {        
        this.listOfMajor = rs.data;
        this.listOfDisplayMajor = rs.data;
      })
    ).subscribe();
  }  

  onRedirect(): void {
    this.router.navigate['admin/core/article/censor']
  }
  

  changeTab(event: NbTabComponent){  
    if (event.tabTitle === "top bài viết") {
      this.topArticle.ngOnInit();      
    } 
    if (event.tabTitle === "bài viết đã duyệt") {
      this.listOfArticle = undefined;      
      this.getListOfArticle(1, 8, 1);      
      this.gridOne.resetPageModel();     
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
    } 
    if (event.tabTitle === "chờ duyệt bài") {
      this.listOfArticle = undefined;      
      this.getListOfArticle(1, 8, 0);      
      this.gridOne.resetPageModel();     
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
    }
    if (event.tabTitle === "bài viết bị chặn") {
      this.listOfArticle = undefined;      
      this.getListOfArticle(1, 8, 2);      
      this.gridOne.resetPageModel();     
      this.gridTwo.resetPageModel();
      this.gridThree.resetPageModel();
    }
  }

  pagination(event: PageModel): void {    
    this.listOfArticle = undefined;
    this.getListOfArticle(event.pageNumber, event.pageSize, event.status);    
  }
    
}
