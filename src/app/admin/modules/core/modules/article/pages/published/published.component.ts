import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, MajorRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss']
})
export class PublishedComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    protected readonly router: Router,
    private _articleService: ArticleService,
    private _universityService: UniversityService,
    private _majorService: MajorService,
    private notification: NzNotificationService,
  ) {
    this.initDateForm();
  }

  article: ArticleVM = {
    content: '<nz-skeleton [nzActive]="true"></nz-skeleton>'
  };

  unCensorshipList: number[];
  unPublishedList: number[];

  articleId: string | number;
  currentIndex: number = 0;
  //----------------------
  listOfUniversity: University[];
  listOfDisplayUniversity: University[] = [];
  listOfSelectedUniversity = [];
  //-----------------------

  //------------------------
  listOfMajor: MajorRM[];
  listOfDisplayMajor: MajorRM[] = [];
  listOfSelectedMajor = [];
  //------------------------
  //------------------------
  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];
  dateForm: FormGroup;

  ngOnInit() {
    this.getUnPublishedList();
    this.getListOfUniversity();
    this.getListOfMajor();
  }

  getListOfUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfUniversity = rs.data;
            this.listOfDisplayUniversity = rs.data;
          } else {
            Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
          }
        } else {
          this.listOfUniversity = [];
          this.listOfDisplayUniversity = [];
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }


  getListOfMajor(): void {
    this._majorService.getAllMajor().pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfMajor = rs.data;
            this.listOfDisplayMajor = rs.data;
          } else {
            Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
          }
        } else {
          this.listOfMajor = [];
          this.listOfDisplayMajor = [];
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }

  confirmArticle(status?: string): void {
    var newValue = {};
    switch (status) {
      case 'published':
        newValue = {
          'id': this.articleId,
          'publicFromDate': (this.dateForm.get('publicFromDate').value as Date).toLocaleString(),
          'publicToDate': (this.dateForm.get('publicToDate').value as Date).toLocaleString(),
          'status': 3,
          'university': this.listOfSelectedUniversity,
          'major': this.listOfSelectedMajor
        }
        Swal.fire({
          title: 'ĐĂNG BÀI',
          text: "Bài viết sẽ được đăng lên trang tin của hệ thống.",
          icon: 'question',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'XÁC NHẬN',
          denyButtonColor: '#00d68f',
          cancelButtonColor: '#d33',
          cancelButtonText: 'HỦY'
        }).then((result) => {
          if (result.isConfirmed) {
            this._articleService.confirmArticle(newValue).pipe(
              tap((rs) => {
                if (rs.succeeded === true) {
                  this.createNotification('success', 'ĐĂNG BÀI', 'Đăng bài viết thành công', 'bottomRight');
                  this.nextElement();
                } else {
                  this.createNotification('error', 'ĐĂNG BÀI', 'Đăng bài viết thất bại', 'bottomRight');
                }
              }),
              catchError(err => {
                return of(err);
              })
            ).subscribe();
          }
        })
        break;
      case 'accept':
        newValue = {
          'id': this.articleId,
          'publicFromDate': null,
          'publicToDate': null,
          'status': 1,
          'university': this.listOfSelectedUniversity,
          'major': this.listOfSelectedMajor
        }
        Swal.fire({
          title: 'DUYỆT BÀI',
          text: "Bài viết được duyệt sẽ được chuyển đến danh sách chờ đăng bài viết lên trang tin",
          icon: 'question',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'XÁC NHẬN',
          denyButtonColor: '#00d68f',
          cancelButtonColor: '#d33',
          cancelButtonText: 'HỦY'
        }).then((result) => {
          if (result.isConfirmed) {
            this._articleService.confirmArticle(newValue).pipe(
              tap((rs) => {
                if (rs.succeeded === true) {
                  this.createNotification('success', 'DUYỆT BÀI VIẾT', 'Duyệt bài viết thành công', 'bottomRight');
                  // this.showElement(this.unCensorshipList, this.currentIndex);
                  this.nextElement();
                } else {
                  this.createNotification('error', 'Duyệt Bài', 'Duyệt bài viết thất bại', 'bottomRight');
                }
              }),
              catchError(err => {
                return of(err);
              })
            ).subscribe();
          }
        })
        break;
      case 'deny':
        newValue = {
          'id': this.articleId,
          'publicFromDate': null,
          'publicToDate': null,
          'status': 0,
          'university': [],
          'major': []
        }
        Swal.fire({
          title: 'BỎ DUYỆT BÀI',
          text: "Bài viết được duyệt sẽ được chuyển đến danh sách chờ duyệt bài.",
          icon: 'warning',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'XÁC NHẬN',
          denyButtonColor: '#00d68f',
          cancelButtonColor: '#d33',
          cancelButtonText: 'HỦY'
        }).then((result) => {
          if (result.isConfirmed) {
            this._articleService.confirmArticle(newValue).pipe(
              tap((rs) => {
                if (rs.succeeded === true) {
                  this.createNotification('success', 'BỎ DUYỆT BÀI VIẾT', 'BỎ DUYỆT bài viết thành công', 'bottomRight');
                  this.showElement(this.unCensorshipList, this.currentIndex);
                } else {
                  this.createNotification('error', 'BỎ DUYỆT BÀI VIẾT', 'Thất bại', 'bottomRight');
                }
              })
            ).subscribe();
          }
        })
        break;
      case 'reject':
        newValue = {
          'id': this.articleId,
          'publicFromDate': null,
          'publicToDate': null,
          'status': 2,
          'university': [],
          'major': []
        }
        Swal.fire({
          title: 'CHẶN BÀI VIẾT',
          text: "Bài viết sẽ được chuyển tiếp vào danh sách các bài viết bị chặn.",
          icon: 'warning',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'XÁC NHẬN',
          denyButtonColor: '#00d68f',
          cancelButtonColor: '#d33',
          cancelButtonText: 'HỦY'
        }).then((result) => {
          if (result.isConfirmed) {
            this._articleService.confirmArticle(newValue).pipe(
              tap((rs) => {
                if (rs.succeeded === true) {
                  this.createNotification('success', 'BỎ DUYỆT BÀI VIẾT', 'BỎ DUYỆT bài viết thành công', 'bottomRight');
                  this.showElement(this.unPublishedList, this.currentIndex);
                } else {
                  this.createNotification('error', 'BỎ DUYỆT BÀI VIẾT', 'Thất bại', 'bottomRight');
                }
              })
            ).subscribe();
          }
        })
        break;
      case 'unReject':
        newValue = {
          'id': this.articleId,
          'publicFromDate': null,
          'publicToDate': null,
          'status': 0,
          'university': [],
          'major': []
        }
        Swal.fire({
          title: 'GỠ CHẶN BÀI VIẾT',
          text: "Bài viết sẽ được chuyển tiếp vào danh sách các bài viết chờ duyệt.",
          icon: 'warning',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'XÁC NHẬN',
          denyButtonColor: '#00d68f',
          cancelButtonColor: '#d33',
          cancelButtonText: 'HỦY'
        }).then((result) => {
          if (result.isConfirmed) {
            this._articleService.confirmArticle(newValue).pipe(
              tap((rs) => {
                if (rs.succeeded === true) {
                  this.createNotification('success', 'GỠ CHẶN BÀI VIẾT', 'Gỡ chặn bài viết thành công', 'bottomRight');
                  this.showElement(this.unPublishedList, this.currentIndex);
                  // this.nextElement();
                } else {
                  this.createNotification('error', 'GỠ CHẶN BÀI BÀI VIẾT', 'Thất bại', 'bottomRight');
                }
              })
            ).subscribe();
          }
        })
        break;
      case 'unPublished':
        newValue = {
          'id': this.articleId,
          'publicFromDate': null,
          'publicToDate': null,
          'status': 5,
          // 'university': this.listOfSelectedUniversity,
          // 'major': this.listOfSelectedMajor
          'university': [],
          'major': []
        };
        Swal.fire({
          title: 'HỦY ĐĂNG BÀI',
          text: "Bài viết sẽ được chuyển tiếp về danh sách cần được xem xét.",
          icon: 'warning',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'XÁC NHẬN',
          denyButtonColor: '#00d68f',
          cancelButtonColor: '#d33',
          cancelButtonText: 'HỦY'
        }).then((result) => {
          if (result.isConfirmed) {
            this._articleService.confirmArticle(newValue).pipe(
              tap((rs) => {
                if (rs.succeeded === true) {
                  this.createNotification('success', 'ĐĂNG BÀI', 'Đăng bài viết thành công', 'bottomRight');
                  this.showElement(this.unPublishedList, this.currentIndex);
                } else {
                  this.createNotification('error', 'ĐĂNG BÀI', 'Đăng bài viết thất bại', 'bottomRight');
                }
              }),
              catchError(err => {
                return of(err);
              })
            ).subscribe();
          }
        });
        break;
      default:
        break;
    }
  }


  setDataToDateForm(publicFromDate: Date, publicToDate: Date): void {
    this.dateForm.get('publicFromDate').setValue(publicFromDate);
    this.dateForm.get('publicToDate').setValue(publicToDate);
  }

  getArticleById(id: number): void {
    this._articleService.getArticleById(id).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfSelectedUniversity = rs.data.universityIds;
            this.listOfSelectedMajor = rs.data.majorIds;
            this.article = rs.data;
            this.articleId = rs.data.id;
            this.setDataToDateForm(rs.data.publicFromDate, rs.data.publicToDate);
          } else {
            this.article = null;
          }
        } else {
          this.article = null;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      }),
      catchError((err) => {
        this.article = null;
        return of(undefined);
      })
    ).subscribe();
  }

  getUnPublishedList(): void {
    this._articleService.getApprovedArticleList().pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          this.unPublishedList = rs.data
          this.showElement(this.unPublishedList, 0);
        }
      })
    ).subscribe();
  }

  showElement(array: number[], index: number) {
    if (array[index] != undefined) {
      this.getArticleById(array[index]);
    }
  }

  nextElement(): void {
    this.currentIndex = this.currentIndex < this.unPublishedList.length - 1 ? this.currentIndex + 1 : this.unPublishedList.length - 1;
    this.showElement(this.unPublishedList, this.currentIndex);
  }

  preElement(): void {
    this.currentIndex === 0 ? this.currentIndex : this.currentIndex--;
    this.showElement(this.unPublishedList, this.currentIndex);
  }
  initDateForm(): void {
    this.dateForm = this._fb.group({
      'publicFromDate': [new Date, Validators.required],
      'publicToDate': [new Date, Validators.required]
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

  today = new Date();

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0

  createNotification(type: string, title: string, message: string, position?: NzNotificationPlacement): void {
    this.notification.create(
      type,
      title,
      message,
      { nzPlacement: position }
    );
  }

}
