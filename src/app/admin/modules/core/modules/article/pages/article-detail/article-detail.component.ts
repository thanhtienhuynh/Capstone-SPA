import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM } from 'src/app/admin/view-models';
import { PagedResponse } from 'src/app/_models/paged-response';
import { University } from 'src/app/_models/university';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    private _articleService: ArticleService,
    private _universityService: UniversityService,
    private notification: NzNotificationService
  ) { 
    this.initDateForm();
  }

  article: ArticleVM = {
    content: '<nz-skeleton [nzActive]="true"></nz-skeleton>'
  };

  articleId: string;
  //----------------------
  listOfUniversity: University[];
  listOfDisplayUniversity: University[] = [];  
  listOfSelectedUniversity = [];
  //-----------------------

  //------------------------
  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];
  dateForm: FormGroup;

  ngOnInit() {
    this.getArticleById();
    this.getListOfUniversity();    
  }

  useUpdate(): void {    
    this.router.navigate(['admin/core/article/details/3']);      
  }

  initDateForm(): void {
    this.dateForm = this._fb.group({
      'publicFromDate': [new Date],
      'publicToDate': [new Date]
    })
  }

  setDataToDateForm(publicFromDate: Date, publicToDate: Date): void {
    this.dateForm.get('publicFromDate').setValue(publicFromDate);
    this.dateForm.get('publicToDate').setValue(publicToDate);
  }
  getArticleById(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.articleId = param.id;
      this._articleService.getArticleById(param.id).pipe(
        tap((rs) => {
          console.log(rs);
          if (rs.succeeded === true) {   
            this.listOfSelectedUniversity = rs.data.universityIds;                  
            this.article = rs.data;  
            this.setDataToDateForm(rs.data.publicFromDate, rs.data.publicToDate);
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

  getListOfUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {
        console.log(rs);
        this.listOfUniversity = rs.data
        this.listOfDisplayUniversity = rs.data
      })
    ).subscribe();    
  }

  confirmArticle(status?: string): void {    
     const newValue = {
      'id': this.articleId,
      'publicFromDate': this.publicFromDate,
      'publicToDate': this.publicToDate,
      'status': status === 'accept' ? 1 : 2,
      'university': this.listOfSelectedUniversity
    }
    console.log(newValue);
    this._articleService.confirmArticle(newValue).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          status === 'accept' ? this.createNotification('success', 'Đăng bài', 'Đăng bài viết thành công', 'bottomRight') : this.createNotification('success', 'Hủy đăng bài', 'Hủy đăng bài viết thành công', 'bottomRight')          
          this.getArticleById();
        } else {
          this.createNotification('error', '', rs.message);
        }        
      })
    ).subscribe();    
  }
  //Date
  onChangeFromDate(result: Date): void {
    this.publicFromDate = result;    
  }

  onOkFromDate(result: Date | Date[] | null): void {
    this.publicFromDate = result;    
  }

  onCalendarChangeFromDate(result: Array<Date | null>): void {
    
  }

  onChangeToDate(result: Date): void {
    this.publicToDate = result;    
  }

  onOkToDate(result: Date | Date[] | null): void {
    this.publicToDate = result;    
  }

  onCalendarChangeToDate(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
  }

  

  getListOfSelectedUniversity(): void {
    console.log(this.listOfSelectedUniversity);
    console.log(this.articleId)
  }

  createNotification(type: string, title: string, message: string, position?: NzNotificationPlacement): void {
    this.notification.create(
      type,
      title,
      message,
      { nzPlacement: position }
    );
  }
}
