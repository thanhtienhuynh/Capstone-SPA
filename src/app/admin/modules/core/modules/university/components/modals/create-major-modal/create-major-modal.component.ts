import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MajorService, SubjectGroupService } from 'src/app/admin/services';
import { MajorRM, SubjectGroupRM } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-major-modal',
  templateUrl: './create-major-modal.component.html',
  styleUrls: ['./create-major-modal.component.scss']
})
export class CreateMajorModalComponent implements OnInit {

  //Decorator
  @Input() data: MajorRM | undefined;
  @Input() universityId: any;
  
  //Style
  col_md_3 = 'col-md-3';

  //Title
  modalTitle: string = "Thêm Ngành";

  //FormGroup
  majorForm: FormGroup;
  listField: FormGroup[] = [];

  //Prototype Data
  listOfMajor: MajorRM[] = [ 
  ];  

  result: any[];
  subjectGroupResult: any[];

  listOfSubjectGroup: SubjectGroupRM[] = [];
  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _majorService: MajorService,
    private _subjectGroupService: SubjectGroupService
  ) { 
    this.initMajorForm();    
  }  
  ngOnInit() {    
    this.setData();    
    this.getAllMajor();
    this.getAllSubjectGroup();
  }

  getAllMajor(): void {    
    this._majorService.getAllMajor().subscribe((rs) => {                
      this.result = rs;                         
      this.options = rs;           
      this.filteredControlOptions$ = of(this.options);        
    });
  }

  getAllSubjectGroup(): void {
    this._subjectGroupService.getAllSubjectGroup().subscribe((rs) => {
      this.subjectGroupResult = rs;
    })
  }

  getIdByNameAndCode(name: any, code: any): number {
    const temp: MajorRM[] = this.result.filter((rs) => rs.name == name && rs.code == code);
    return temp[0].id;
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
      console.log(this.data);
      this.modalTitle = "Sửa Thông Tin Ngành";
      this.majorForm.get('name').setValue(this.data.name);
      this.majorForm.get('code').setValue(this.data.code);
      this.majorForm.get('numberOfStudent').setValue(this.data.numberOfStudents);
      if (this.data.subjectGroups.length > 0) {
        for (let i = 0; i < this.data.subjectGroups.length; i++) {
          const subJectGroup = this.data.subjectGroups[i];
          this.listField.push(this._fb.group({
            'groupCode': [`${subJectGroup.groupCode}`],      
            'entryMark1': [`${subJectGroup.entryMarks[0].mark}`],
            'entryMark2': [`${subJectGroup.entryMarks[1].mark}`], 
          })); 
        }
      }
    } else {
      this.addField();
    }
  }

  cancle(): void {
    this.closeModal();
  }

  closeModal(): void {
    this._modalRef.close();
  }

  submitForm(): void {
    const subjectGroups: SubjectGroupRM[] = [];
    const tmp = this.listField.map(e => e.value);
    for (let i = 0; i < tmp.length; i++) {
      subjectGroups.push({
        id: Number.parseInt(tmp[i].groupCode),               
        entryMarks: [
          {
            mark: tmp[i].entryMark1,
            year: 2019
          },
          {
            mark: tmp[i].entryMark2,
            year: 2020
          }
        ]
      });      
    }   
    console.log(subjectGroups); 
    const newValue = {
      'universityId': Number.parseInt(this.universityId),
      'majorId': this.majorForm.get('name').value,
      "majorName": '',
      "numberOfStudents": Number.parseInt(this.majorForm.get('numberOfStudent').value),
      "code": this.majorForm.get('code').value,
      "subjectGroups": subjectGroups
    }
    console.log(newValue);
    this._majorService.createMajor({} as any).pipe(
      tap((rs) => {
        Swal.fire('Thành công', 'Thêm ngành mới thành công', 'success');
      }),
      catchError((err) => {
        Swal.fire('Lỗi', 'Thêm ngành mới thất bại', 'error');
        return of(undefined);
      })
    ).subscribe();
    // console.log(this.listField.map(e => e.value));
  }

  updateForm(): void {    
    const newValue = {

    };
    this._majorService.updateMajor({} as any).pipe(
      tap((rs) => {
        Swal.fire('Thành công', 'Thay đổi thông tin thành công', 'success');
      }),
      catchError((err) => {
        Swal.fire('Lỗi', 'Thay đổi thông tin thất bại', 'error');
        return of(undefined);
      })
    ).subscribe();
  }

  addField(): void {
    this.listField.push(this._fb.group({
      'groupCode': [''],      
      'entryMark1': [''],
      'entryMark2': [''], 
    }));    
  }

  removeField(index: number): void {
    this.listField.splice(index, 1);
  }


  //------------------------------------ Auto complete -----------------------
  options: string[];
  filteredControlOptions$: Observable<string[]>;

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }    
  
  selectedValue = null;
  selectedSubjectGroupValue = null;
}
