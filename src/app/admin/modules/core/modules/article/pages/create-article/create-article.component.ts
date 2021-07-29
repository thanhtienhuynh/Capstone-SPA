import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { MajorRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';
import Swal from 'sweetalert2';
import { ReviewCreateArticleModalComponent } from '../../components';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {

  editorOptions = quillConfiguration;
  constructor(
    private _fb: FormBuilder,
    protected readonly router: Router,
    private _articleService: ArticleService,
    private _universityService: UniversityService,
    private _majorService: MajorService,
    private _modalService: NzModalService
  ) {
    this.initArticleForm();
  }

  listOfUniversity: University[];
  listOfDisplayUniversity: University[] = [];
  listOfSelectedUniversity = [];
  //-----------------------

  //------------------------
  listOfMajor: MajorRM[];
  listOfDisplayMajor: MajorRM[] = [];
  listOfSelectedMajor = [];

  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];

  articleForm: FormGroup;
  ngOnInit() {
    this.getListOfMajor();
    this.getListOfUniversity();
  }

  initArticleForm(): void {
    this.articleForm = this._fb.group({
      'Title': ['', Validators.required],
      'Content': ['', Validators.required],
      'ShortDescription': ['', Validators.required],
    })
  }


  getListOfUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {
        this.listOfUniversity = rs.data;
        this.listOfDisplayUniversity = rs.data;
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

  logo: string | ArrayBuffer;
  image: File;
  uploadLogo(evt: any): void {
    const files: File[] = evt.target.files;
    if (files.length > 1) {
      Swal.fire('Lỗi', 'Chỉ được chọn 1 file', 'error');
    } else {
      const file = files[0];
      const extensions: string[] = ['image/png', 'image/jpeg', 'image/jpg'];
      if (extensions.includes(file.type)) {
        if (file.size < 1024 * 1204 * 2) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.logo = reader.result
          };
          reader.readAsDataURL(file);
          this.image = files[0];
        } else {
          Swal.fire('Oversize', 'Vui lòng chọn ảnh có kích thước từ 2MB trở xuống', 'error');
        }
      } else {
        Swal.fire('Lỗi', 'Vui lòng chỉ chọn file ảnh (.png, .jpeg, .jpg)', 'error');
      }
    }
  }

  createArticle(): void {
    const newValue = {
      'Title': this.articleForm.get('Title').value,
      'ShortDescription': this.articleForm.get('ShortDescription').value,
      'Content': this.articleForm.get('Content').value,
      'PostImage': this.image ? this.image : null,
      'UniversityIds': this.listOfSelectedUniversity,
      'MajorIds': this.listOfSelectedUniversity
    };    
    this.openUpdateModal(newValue);
    // const formData = new FormData();
    // for (let key in newValue) {
    //   formData.append(key, newValue[key]);
    // }
    // this._articleService.createArticle(formData).pipe(
    //   tap(rs => {
    //     console.log(rs);
    //     if (rs.succeeded === true) {
    //       Swal.fire('Thành công', 'Tạo mới bài viết thành công', 'success');
    //     } else {
    //       Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
    //     }
    //   })
    // ).subscribe();
  }

  clearForm(): void {
    this.articleForm.reset();
    this.listOfSelectedMajor = [];
    this.listOfSelectedUniversity = []
    this.logo = '';
  }

  openUpdateModal(data: any): void {
    const modal = this._modalService.create({
      nzContent: ReviewCreateArticleModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 1000,
      nzComponentParams: {
        data: data, callBack: () => {
          this.clearForm();
        }
      },
    });
    modal.afterClose.pipe(
      tap((rs) => {
      })
    ).subscribe();
  }

  removeFile(): void {
    
  }
}

