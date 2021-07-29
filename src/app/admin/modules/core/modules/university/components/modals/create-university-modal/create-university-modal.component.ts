import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { UniversityService } from 'src/app/admin/services';
import { UniversityRM } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-create-university-modal',
  templateUrl: './create-university-modal.component.html',
  styleUrls: ['./create-university-modal.component.scss']
})
export class CreateUniversityModalComponent implements OnInit {

  
  @Input() callBack: (item: UniversityRM & { stt?: number, phones?: string[] }) => void;  
  @Input() index: any;

  isLoadingCreation: boolean = false;
  logo: string | ArrayBuffer;
  createUniversityForm: FormGroup;
  editorOptions = quillConfiguration;

  selectedItem = '0';
  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _uniService: UniversityService
  ) {

  }

  ngOnInit() {
    this.initCreateUniversityForm();
  }

  initCreateUniversityForm(): void {
    this.createUniversityForm = this._fb.group({
      'name': ['', Validators.required],
      'code': ['', Validators.required],
      'address': ['', Validators.required],
      'phone': ['', Validators.required],
      'webUrl': ['', Validators.required],
      'tuitionType': [0],
      'tuitionFrom': ['', Validators.required],
      'tuitionTo': ['', Validators.required],
      'description': [''],
      'rating': [5],
      'status': [0]
    })
  };

  cancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this._modalRef.close();
  }

  submitForm(): void {
    this.isLoadingCreation = true;
    if (this.createUniversityForm.valid) {
      const newUni = {
        'File': this.image ? this.image : null,
        'Code': this.createUniversityForm.get('code').value,
        'Name': this.createUniversityForm.get('name').value,
        'Address': this.createUniversityForm.get('address').value,
        'LogoUrl': '',
        'Description': this.createUniversityForm.get('description').value !== "" ? this.createUniversityForm.get('description').value : null,
        'Phone': this.createUniversityForm.get('phone').value,
        'WebUrl': this.createUniversityForm.get('webUrl').value,
        'TuitionType': this.createUniversityForm.get('tuitionType').value,
        'TuitionFrom': this.createUniversityForm.get('tuitionFrom').value,
        'TuitionTo': this.createUniversityForm.get('tuitionTo').value,
        'Rating': this.createUniversityForm.get('rating').value,
        'Status': this.createUniversityForm.get('status').value
      }
      const formData = new FormData();
      for (let key in newUni) {
        formData.append(key, newUni[key]);
      }
      this._uniService.createUniversity(formData).pipe(
        tap((rs) => {
          if (rs.succeeded === true) {
            this.isLoadingCreation = false;
            Swal.fire('Thành Công', 'Thêm mới trường đại học thành công', 'success');
            this.callBack(rs.data);
            this.closeModal();
          } else {
            this.isLoadingCreation = false;
          }                
        }),
        catchError((err) => {
          Swal.fire('Lỗi', 'Thêm mới trường đại học thất bại', 'error');
          return of(undefined);
        })
      ).subscribe();      
    }
  }


  image: File;
  uploadLogo(evt): void {
    const files: File[] = evt.target.files;
    if (files.length > 1) {
      Swal.fire('Lỗi', 'Chọn 1 cái thối', 'error');
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
}
