import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isThisSecond } from 'date-fns';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';

@Component({
  selector: 'app-censorship',
  templateUrl: './censorship.component.html',
  styleUrls: ['./censorship.component.scss']
})
export class CensorshipComponent implements OnInit {

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

  unCensorshipList: number[];

  articleId: string | number;
  currentIndex: number = 0;
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
    this.getUnApprovedArticleIdList();
    this.getListOfUniversity();
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
          this.showElement(this.unCensorshipList, this.currentIndex);
        } else {
          this.createNotification('error', 'Duyệt Bài', rs.message, 'bottomRight');
        }        
      })
    ).subscribe();    
  }

  setDataToDateForm(publicFromDate: Date, publicToDate: Date): void {
    this.dateForm.get('publicFromDate').setValue(publicFromDate);
    this.dateForm.get('publicToDate').setValue(publicToDate);
  }
  getArticleById(id: number): void {
    this._articleService.getArticleById(id).pipe(
      tap((rs) => {
        // console.log(rs);
        if (rs.succeeded === true) {   
          this.listOfSelectedUniversity = rs.data.universityIds;                  
          this.article = rs.data;  
          this.articleId = rs.data.id;
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
  }

  getUnApprovedArticleIdList(): void {
    this._articleService.getUnApprovedArticleIdList().pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          this.unCensorshipList = rs.data
          this.showElement(this.unCensorshipList, 0);
        }
      })
    ).subscribe();
  }

  showElement(array:number[], index: number){
    if (array[index] != undefined) {
      this.getArticleById(array[index]);
    }
  }

  nextElement(): void {      
    this.currentIndex++;    
    this.showElement(this.unCensorshipList, this.currentIndex);    
  }

  preElement(): void {
    this.currentIndex === 0 ? this.currentIndex : this.currentIndex--;
    this.showElement(this.unCensorshipList, this.currentIndex);    
  }
  initDateForm(): void {
    this.dateForm = this._fb.group({
      'publicFromDate': [new Date],
      'publicToDate': [new Date]
    })
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
