import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, MajorRM } from 'src/app/admin/view-models';
import { PagedResponse } from 'src/app/_models/paged-response';
import { University } from 'src/app/_models/university';
import Swal from 'sweetalert2';

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
    private _majorService: MajorService,
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
  listOfMajor: MajorRM[];
  listOfDisplayMajor: MajorRM[]=[];
  listOfSelectedMajor = [];
  //------------------------

  //------------------------
  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];
  dateForm: FormGroup;

  ngOnInit() {
    this.getArticleById();
    this.getListOfUniversity();  
    this.getListOfMajor(); 
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

  confirmArticle(status?: string): void {    
     const newValue = {
      'id': this.articleId,
      'publicFromDate': this.publicFromDate,
      'publicToDate': this.publicToDate,
      'status': status === 'accept' ? 1 : 2,
      'university': this.listOfSelectedUniversity,
      'major': this.listOfSelectedMajor
    }    
    Swal.fire({
      title: status === 'accept' ? 'DUYỆT BÀI' : 'CHẶN BÀI VIẾT',
      text: status === 'accept' ? "Bài viết được duyệt sẽ được đăng lên trang tin của hệ thống." : "Bài viết bị chặn sẽ không còn được đăng lên trang tin của hệ thống.",
      icon: 'warning',
      showCancelButton: true,
      showLoaderOnConfirm: true,            
      confirmButtonColor: '#3085d6',
      confirmButtonText: status === 'accept' ? 'Duyệt': 'Chặn',      
      denyButtonColor: '#00d68f',      
      cancelButtonColor: '#d33',      
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this._articleService.confirmArticle(newValue).pipe(
          tap((rs) => {
            if (rs.succeeded === true) {
              status === 'accept' ? this.createNotification('success', 'DUYỆT BÀI VIẾT', 'Duyệt bài viết thành công', 'bottomRight') : this.createNotification('success', 'CHẶN BÀI VIẾT', 'Chặn bài viết thành công', 'bottomRight')          
              this.getArticleById();
            } else {
              this.createNotification('error', 'Duyệt Bài', 'Duyệt bài viết thất bại', 'bottomRight');
            }        
          })
        ).subscribe();  
      }
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
