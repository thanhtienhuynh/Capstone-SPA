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

  //Decorator
  @Input() data: MajorRM | undefined;
  
  //Style
  col_md_3 = 'col-md-3';

  //Title
  modalTitle: string = "Thêm Ngành";

  //FormGroup
  majorForm: FormGroup;
  listField: FormGroup[] = [];

  //Prototype Data
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

  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
  ) { 
    this.initMajorForm();
    this.addField();
  }

  ngOnInit() {    
    this.setData();
  }

  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'name': [''],
      'code': [''],           
      'numberOfStudent': ['']
    })
  }

  setData(): void {
    if (this.data != undefined) {
      this.modalTitle = "Sửa Thông Tin Ngành";
      this.majorForm.get('name').setValue(this.data.name);
      this.majorForm.get('code').setValue(this.data.code);
      this.majorForm.get('numberOfStudent').setValue(this.data.numberOfStudent);
    }
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
