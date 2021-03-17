import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isThisSecond } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
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

  @Input() callBack: (item: UniversityRM) => void;

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
      'address': [''],
      'phone': [''],
      'webUrl': [''],
      'tuitionType': [''],
      'tuitionFrom': [''],
      'tuitionTo': [''],
      'description': [''],  
      'rating': [''],
      'status': ['']
    })
  };

  cancel(): void {
    this.closeModal();
  }
  
  closeModal(): void {
    this._modalRef.close();
  }

  submitForm(): void {    
    if(this.createUniversityForm.valid){    
      const newUni = {
        'Code': this.createUniversityForm.get('code').value,
        'Name': this.createUniversityForm.get('name').value,
        'Address': this.createUniversityForm.get('address').value,
        'LogoUrl': '',
        'Description': this.createUniversityForm.get('description').value,
        'Phone': this.createUniversityForm.get('phone').value,
        'WebUrl': this.createUniversityForm.get('webUrl').value,
        'TuitionType': this.createUniversityForm.get('tuitionType').value,
        'TuitionFrom': this.createUniversityForm.get('tuitionFrom').value,
        'TuitionTo': this.createUniversityForm.get('tuitionTo').value,
        'Rating': this.createUniversityForm.get('rating').value,
        'Status': this.createUniversityForm.get('status').value
      }      
      this._uniService.createUniversity(newUni).pipe(
        tap((rs) => {          
          this.callBack(rs);
          Swal.fire('Thành Công', 'Thêm mới trường đại học thành công', 'success');          
        }),
        catchError((err) => {
          Swal.fire('Lỗi', 'Thêm mới trường đại học thất bại', 'error');
          return of(undefined);          
        })
      ).subscribe();
      this.closeModal();
    } 
  }  
  


  uploadLogo(evt): void {
    console.log(evt);
    const files: File[] = evt.target.files;
    if (files.length > 1) {
      Swal.fire('Lỗi', 'Chọn 1 cái thối', 'error');
    } else {
      const file = files[0];
      const extensions: string[] = ['image/png', 'image/jpeg', 'image/jpg'];
      if (extensions.includes(file.type)) {
        if (file.size < 1024*1204*2) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.logo = reader.result
          };
          reader.readAsDataURL(file);
        } else {
          Swal.fire('Oversize', 'Vui lòng chọn ảnh có kích thước từ 2MB trở xuống', 'error');
        }
      } else {
        Swal.fire('Lỗi', 'Vui lòng chỉ chọn file ảnh (.png, .jpeg, .jpg)', 'error');
      }
    }
  }
}
