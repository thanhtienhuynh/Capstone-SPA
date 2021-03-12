import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isThisSecond } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { UniversityService } from 'src/app/admin/services';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-university-modal',
  templateUrl: './create-university-modal.component.html',
  styleUrls: ['./create-university-modal.component.scss']
})
export class CreateUniversityModalComponent implements OnInit {

  logo: string | ArrayBuffer;
  createUniversityForm: FormGroup;
  editorOptions = quillConfiguration;

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
      'tuition': [''],
      'infomation': [''],     
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
      this._uniService.createUniversity({} as any).pipe(
        catchError((err) => {
          Swal.fire('Lỗi', 'Thêm mới trường đại học thất bại', 'error');
          return of(undefined);          
        })
      ).subscribe();
      this.closeModal();
    } 
  }  

  defaultFileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error'
    }
  ];

  fileList1 = [...this.defaultFileList];
  fileList2 = [...this.defaultFileList];


  uploadLogo(evt): void {
    console.log(evt);
    const files: File[] = evt.target.files;
    if (files.length > 1) {
      Swal.fire('Error', 'Chọn 1 cái thối', 'error');
    } else {
      const file = files[0];
      const extensions: string[] = ['image/png', 'image/jpeg', 'image/jpg'];
      if (extensions.includes(file.type)) {
        if (file.size < 1024*1024*2) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.logo = reader.result
          };
          reader.readAsDataURL(file);
        } else {
          Swal.fire('Error', 'Chỉ đc 2MB', 'error');
        }
      } else {
        Swal.fire('Error', 'Chỉ được chọn ảnh', 'error');
      }
    }
  }
}
