import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';

@Component({
  selector: 'app-article-main',
  templateUrl: './article-main.component.html',
  styleUrls: ['./article-main.component.scss']
})
export class ArticleMainComponent implements OnInit {
  
  gen: any[] = [1, 2, 3, 4, 5];
  isLoading: boolean = true;
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  listOfArticle: ArticleVM[] = [    
  ];

  listOfUniversity: University[];
  listOfDisplayUniversity: University[] = [];  
  listOfSelectedUniversity = [];

  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];
  constructor(
    private _articleService: ArticleService,
    protected readonly router: Router,
    private _universityService: UniversityService,
  ) { }

  ngOnInit() {
    this.getListOfArticle(this.pageNumber, this.pageSize);
    this.getListOfUniversity();
  }

  
  getListOfArticle(pageNumber: number, pageSize: number): void {
    this._articleService.getListOfArticle(pageNumber, pageSize).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          this.isLoading = false;
          this.listOfArticle = rs.data;                    
          this.totalRecords = rs.totalRecords;          
        } else {
          this.isLoading = true;
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
  onPageSizeChange(data: any){
    console.log(data);
    this.isLoading = true;    
    this.pageSize = data;
    this.getListOfArticle(this.pageNumber, this.pageSize);
  }

  onPageIndexChange(data: any){
    console.log(data);
    this.isLoading = true;    
    this.pageNumber = data;
    this.getListOfArticle(this.pageNumber, this.pageSize);
  }

  onRedirect(): void {
    this.router.navigate['admin/core/article/censor']
  }
}
