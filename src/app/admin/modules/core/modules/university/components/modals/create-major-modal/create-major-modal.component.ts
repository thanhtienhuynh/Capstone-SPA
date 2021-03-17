import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
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
  @Input() universityName: string;
  @Input() callBack: (majors: MajorRM[]) => void;
  //Style
  col_md_3 = 'col-md-3';

  //Title
  modalTitle: string = "Thêm Ngành";

  //FormGroup
  majorForm: FormGroup;
  listField: FormGroup[] = [];
  listFieldTmp: FormGroup[] = [];

  //Prototype Data
  listOfMajor: MajorRM[] = [];  

  result: any[];
  majorResult: Observable<any[]> = new BehaviorSubject([]);
  subjectGroupResult: Observable<any[]> = new BehaviorSubject([]);

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
    this.getAllMajor();
    this.getAllSubjectGroup();
    this.setData();             
  }

  getAllMajor(): void {    
    // this._majorService.getAllMajor().subscribe((rs) => {                
    //   this.result = rs;                         
    //   this.options = rs;           
    //   this.filteredControlOptions$ = of(this.options);        
    // });
    this.majorResult = this._majorService.getAllMajor();
  }

  getAllSubjectGroup(): void {
    this.subjectGroupResult = this._subjectGroupService.getAllSubjectGroup();
  }

  
  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'name': [undefined, Validators.required],
      'code': ['', Validators.required],           
      'numberOfStudent': ['', Validators.required]
    })
  }

  setData(): void {
    this.subjectGroupResult.subscribe((data) => {
      if (this.data != undefined) {          
        this.modalTitle = "Sửa Thông Tin Ngành của " + `${this.universityName}`;    
        const tmp = {
          id: this.data.id,
          name: this.data.name,
          code: this.data.code
        };
        this.majorForm.get('name').setValue(tmp);
        this.majorForm.get('code').setValue(this.data.code);
        this.majorForm.get('numberOfStudent').setValue(this.data.numberOfStudents);        
        if (this.data.subjectGroups.length > 0) {
          for (let i = 0; i < this.data.subjectGroups.length; i++) {            
            const subJectGroup = this.data.subjectGroups[i];                        
            this.listField.push(this._fb.group({
              'subjectGroup': [data.find((e) => e.id === subJectGroup.id)],   
              'entryMarkId1': [`${subJectGroup.entryMarks[0].id}`],   
              'entryMark1': [`${subJectGroup.entryMarks[0].mark}`],
              'entryMarkId2': [`${subJectGroup.entryMarks[1].id}`],
              'entryMark2': [`${subJectGroup.entryMarks[1].mark}`], 
            })); 
          }
          this.listFieldTmp = this.listField.slice();
        }
      } else {
        this.addField();
      }
    })
  }

  cancle(): void {
    this.closeModal();
  }

  closeModal(): void {
    this._modalRef.close();
  }

  submitForm(): void {
    const subjectGroups: SubjectGroupRM[] = [];
    const tmpUI = this.listField.map(e => e.value);    
    for (let i = 0; i < tmpUI.length; i++) {
      subjectGroups.push({
        id: Number.parseInt(tmpUI[i].subjectGroup.id),               
        entryMarks: [
          {
            mark: Number.parseInt(tmpUI[i].entryMark1),
            year: 2019
          },
          {
            mark: Number.parseInt(tmpUI[i].entryMark2),
            year: 2020
          }
        ]
      });      
    }       
    const newValue = {
      'universityId': Number.parseInt(this.universityId),
      'majorId': this.majorForm.get('name').value.id,
      "majorName": '',
      "numberOfStudents": Number.parseInt(this.majorForm.get('numberOfStudent').value),
      "code": this.majorForm.get('code').value,
      "subjectGroups": subjectGroups
    }
    console.log(newValue);
    this._majorService.createMajor(newValue).pipe(
      tap((rs) => {        
        this.callBack(rs.majors);
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
    const subjectGroups: SubjectGroupRM[] = [];
    const tmp = this.listField.map(e => e.value); 
    const tmpSubmit = this.listFieldTmp.map(e => e.value);
    console.log(tmpSubmit);
    for (let i = 0; i < tmpSubmit.length; i++) {      
      if (tmp.find((e) => e.subjectGroup?.id === tmpSubmit[i].subjectGroup?.id)) {
        tmpSubmit[i] = tmp.find((e) => e.subjectGroup?.id === tmpSubmit[i].subjectGroup?.id)
      } else {
        tmpSubmit[i].subjectGroup.isDeleted = true;
        console.log(tmpSubmit[i].subjectGroup.isDeleted);
      }
    }
    for (let i = 0; i < tmp.length; i++) {
      if(!tmpSubmit.find((e) => e.subjectGroup?.id === tmp[i].subjectGroup?.id)){
        tmpSubmit.push(tmp[i]);
      }
    }    
    console.log(tmpSubmit);
    for (let i = 0; i < tmpSubmit.length; i++) {
      subjectGroups.push({
        id: Number.parseInt(tmpSubmit[i].subjectGroup.id), 
        isDeleted: tmpSubmit[i].subjectGroup.isDeleted,
        entryMarks: [
          {
            id: tmpSubmit[i].entryMarkId1 ? Number.parseInt(tmpSubmit[i].entryMarkId1) : -1,
            mark: Number.parseInt(tmpSubmit[i].entryMark1),
            year: 2019
          },
          {
            id: tmpSubmit[i].entryMarkId2 ? Number.parseInt(tmpSubmit[i].entryMarkId2) : -1,
            mark: Number.parseInt(tmpSubmit[i].entryMark2),
            year: 2020
          }
        ]
      });      
    }      
    const newValue = {
      'universityId': Number.parseInt(this.universityId),
      'majorId': this.majorForm.get('name').value.id,      
      "numberOfStudents": Number.parseInt(this.majorForm.get('numberOfStudent').value),  
      "subjectGroups": subjectGroups
    }
    // console.log(this.listField.map(e => e.value));   
    console.log(newValue); 
    this._majorService.updateMajor(newValue).pipe(
      tap((rs) => {
        console.log(rs);
        this.callBack(rs.majors);
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
      'subjectGroup': [undefined, Validators.required],      
      'entryMark1': ['', Validators.required],
      'entryMark2': ['', Validators.required], 
    }));       
  }

  removeField(index: number, field?: any | undefined): void {    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {                     
        this.listField.splice(index, 1);                  
        this.returnSubjectGroupId(field.value.subjectGroup?.id);        
      }
    })         
  }

  returnSubjectGroupId(id: any | undefined): number {
    if (id === undefined) {
      return -1;
    }
    return id;
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
