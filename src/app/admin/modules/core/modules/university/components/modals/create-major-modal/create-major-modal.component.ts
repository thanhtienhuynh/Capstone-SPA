import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MajorRM } from 'src/app/admin/view-models';


@Component({
  selector: 'app-create-major-modal',
  templateUrl: './create-major-modal.component.html',
  styleUrls: ['./create-major-modal.component.scss']
})
export class CreateMajorModalComponent implements OnInit {

  //Style
  col_md_3 = 'col-md-3';


  majorForm: FormGroup;

  listOfMajor: MajorRM[] = [
    {
      'id': 1,
      'code': 'QTKD',
      'name': 'Quản trị kinh doanh'
    },
    {
      'id': 2,
      'code': 'IT',
      'name': 'Công nghệ thông tin'
    },
    {
      'id': 3,
      'code': 'GV',
      'name': 'Sư phạm'
    }    
  ];

  listField: any[] = [1];
  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {
    this.initMajorForm();
  }

  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'name': [''],
      'code': [''],
      'subjectGroup': [''],      
      'entryMark1': [''],
      'entryMark2': [''],      
      'numberOfStudent': ['']
    })
  }

  cancle(): void {
    this.closeModal();
  }

  closeModal(): void {
    this._modalRef.close();
  }

  submitForm(): void {
    console.log(this.majorForm.get('name').value);
  }

  addField(): void {
    this.listField.push(1);    
  }

  removeField(index: number): void {
    this.listField.splice(index);
  }
}
