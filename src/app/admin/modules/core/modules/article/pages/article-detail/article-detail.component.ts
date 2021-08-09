import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, MajorRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';
import Swal from 'sweetalert2';
import { UpdateArticleComponent } from '../../components';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

  @Input() key: string | number;
  today = new Date();

  constructor(
    private _fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    private _articleService: ArticleService,
    private _universityService: UniversityService,
    private _majorService: MajorService,
    private notification: NzNotificationService,
    private _modalService: NzModalService,
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
  listOfDisplayMajor: MajorRM[] = [];
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
      'publicFromDate': [new Date, Validators.required],
      'publicToDate': [new Date, Validators.required]
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
            this.listOfSelectedMajor = rs.data.majorIds;
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
    var newValue = {};
    switch (status) {
      case 'accept':
        newValue = {
          'id': this.articleId,
          'publicFromDate': null,
          'publicToDate': null,
          'status': 1,
          'university': this.listOfSelectedUniversity,
          'major': this.listOfSelectedMajor
        };
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
                  this.getArticleById();
                } else {
                  this.createNotification('error', 'Duyệt Bài', 'Duyệt bài viết thất bại', 'bottomRight');
                }
              }),
              catchError(err => {
                return of(err);
              })
            ).subscribe();
          }
        });
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
                  this.getArticleById();
                } else {
                  this.createNotification('error', 'BỎ DUYỆT BÀI VIẾT', `${rs.errors[0]}`, 'bottomRight');
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
                  this.createNotification('success', 'CHẶN BÀI VIẾT', 'Chặn bài viết thành công', 'bottomRight');
                  this.getArticleById();
                } else {
                  this.createNotification('error', 'CHẶN BÀI VIẾT', 'Thất bại', 'bottomRight');
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
                  this.getArticleById();
                } else {
                  this.createNotification('error', 'GỠ CHẶN BÀI BÀI VIẾT', 'Thất bại', 'bottomRight');
                }
              })
            ).subscribe();
          }
        })
        break;
      case 'published':
        newValue = {
          'id': this.articleId,
          'publicFromDate': (this.dateForm.get('publicFromDate').value as Date).toLocaleString(),
          'publicToDate': (this.dateForm.get('publicToDate').value as Date).toLocaleString(),
          'status': 3,
          'university': this.listOfSelectedUniversity,
          'major': this.listOfSelectedMajor
        }
        console.log(newValue);
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
                  this.getArticleById();
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
          text: "Bài viết sẽ được chuyển tiếp về danh sách đã được duyệt.",
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
                  this.getArticleById();
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


  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0


  openUpdateModal(): void {
    const modal = this._modalService.create({
      nzContent: UpdateArticleComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 1000,
      nzComponentParams: {
        data: this.article, callBack: () => {
          this.getArticleById()
        }
      },
    });
    modal.afterClose.pipe(
      tap((rs) => {
      })
    ).subscribe();
  }
}
