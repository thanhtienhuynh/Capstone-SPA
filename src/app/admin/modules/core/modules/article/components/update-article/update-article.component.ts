import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, MajorRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.scss']
})
export class UpdateArticleComponent implements OnInit {

  @Input() data: ArticleVM;
  @Input() callBack: () => void;

  editorOptions = quillConfiguration;
  isUpdateLoading: boolean = false;
  updateAriticleForm: FormGroup;

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
  logo: string | ArrayBuffer;
  image: File;

  constructor(
    private _fb: FormBuilder,
    private _articleService: ArticleService,
    private _universityService: UniversityService,
    private _majorService: MajorService,
    private _modelRef: NzModalRef
  ) {
    this.initUpdateArticleForm();
  }

  ngOnInit() {    
    this.setDataToForm();
    this.getListOfMajor();
    this.getListOfUniversity();
  }

  initUpdateArticleForm(): void {
    this.updateAriticleForm = this._fb.group({
      'Id': [''],
      'Title': [''],
      'Content': [''],
      'ShortDescription': [''],
      'PostImageUrl': ['']
    })
  }

  setDataToForm(): void {
    if (this.data === undefined) {
      return;
    }
    this.updateAriticleForm.get('Id').setValue(this.data.id);
    this.updateAriticleForm.get('Title').setValue(this.data.title);
    this.updateAriticleForm.get('Content').setValue(this.data.content);
    this.updateAriticleForm.get('ShortDescription').setValue(this.data.shortDescription);
    this.updateAriticleForm.get('PostImageUrl').setValue(this.data.postImageUrl);
    this.listOfSelectedMajor = this.data.majorIds;
    this.listOfSelectedUniversity = this.data.universityIds;
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

  removeFile(): void {
    this.logo = undefined;
    this.image = null;
  }

  updateArticle(): void {
    this.isUpdateLoading = true;
    const newValue = {
      'Id': this.updateAriticleForm.get('Id').value,
      'Title': this.updateAriticleForm.get('Title').value,
      'ShortDescription': this.updateAriticleForm.get('ShortDescription').value,
      'Content': this.updateAriticleForm.get('Content').value,
      'PostImageUrl': this.updateAriticleForm.get('PostImageUrl').value,
      'PostImage': this.image ? this.image : null,
      'UniversityIds': this.listOfSelectedUniversity,
      'MajorIds': this.listOfSelectedMajor
    };    
    const formData = new FormData();
    for (let key in newValue) {
      formData.append(key, newValue[key]);
    }
    this._articleService.updateArticle(formData).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isUpdateLoading = false;
          Swal.fire('Thành công', 'Sửa đổi bài viết thành công', 'success');
          this.closeModal();
          this.callBack();
        } else {
          this.isUpdateLoading = false;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }

  closeModal(): void {
    this._modelRef.close();
  }
  
}
