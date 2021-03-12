import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MajorRM } from 'src/app/admin/view-models';


@Component({
  selector: 'app-create-major-modal',
  templateUrl: './create-major-modal.component.html',
  styleUrls: ['./create-major-modal.component.scss']
})
export class CreateMajorModalComponent implements OnInit {

  @Input() data: string;
  
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

  listField: FormGroup[] = [];
  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
  ) { 
    this.initMajorForm();
    this.addField();
  }

  ngOnInit() {
    console.log(this.data);
  }

  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'name': [''],
      'code': [''],
      // 'subjectGroup': [''],      
      // 'entryMark1': [''],
      // 'entryMark2': [''],      
      'numberOfStudent': ['']
    })
  }

  setData(): void {

  }

  cancle(): void {
    this.closeModal();
  }

  closeModal(): void {
    this._modalRef.close();
  }

  submitForm(): void {
    console.log(this.majorForm.get('name').value);
    console.log(this.listField.map(e => e.value));
  }

  addField(): void {
    this.listField.push(this._fb.group({
      'subjectGroup': [''],      
      'entryMark1': [''],
      'entryMark2': [''], 
    }));    
  }

  removeField(index: number): void {
    this.listField.splice(index, 1);
  }
}
