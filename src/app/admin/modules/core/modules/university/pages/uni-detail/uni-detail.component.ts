import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';

@Component({
  selector: 'app-uni-detail',
  templateUrl: './uni-detail.component.html',
  styleUrls: ['./uni-detail.component.scss']
})
export class UniDetailComponent implements OnInit {
  
  uniId: string;
  visible = false;
  searchValueName: string = ''; 
  total = 100;
  pageSize = 10;
  pageIndex = 1;
  

  listOfMajors: any;
  listOfDisplayMajors: any = [
    // {
    //   majorName: 'Quản Trị Khách Sạn',
    //   majorDetailUnies: [
    //     {
    //       trainingProgramName: 'Đại trà',
    //       majorDetailCode: "7810201",
    //       admissionQuantity: 298,
    //       majorDetailSubAdmissions: [
    //         {
    //           quantity: 298,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: 1,
    //           provinceId: null,
    //           provinceName: 'TP. Hồ Chí Minh',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 16, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"}
    //           ]
    //         },
    //         {
    //           quantity: 300,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: 0,
    //           provinceName: 'Hà Nội',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 16, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"}
    //           ]
    //         }            
    //       ]
    //     },
    //     {
    //       trainingProgramName: 'CLC',
    //       majorDetailCode: "7810208",
    //       admissionQuantity: 200,
    //       majorDetailSubAdmissions: [
    //         {
    //           quantity: 190,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: 0,
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 16, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"}
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   majorName: 'Công nghệ thông tin',
    //   majorDetailUnies: [
    //     {
    //       trainingProgramName: 'Đại trà',
    //       majorDetailCode: "7810201",
    //       admissionQuantity: 298,
    //       majorDetailSubAdmissions: [
    //         {
    //           quantity: 298,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: 1,
    //           provinceName: 'Hà Nội',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 16, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"}
    //           ]
    //         },
    //         {
    //           quantity: 300,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: null,
    //           provinceName: 'Hà Nội',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 16, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"}
    //           ]
    //         }            
    //       ]
    //     },
    //     {
    //       trainingProgramName: 'CLC',
    //       majorDetailCode: "7810208",
    //       admissionQuantity: 200,
    //       majorDetailSubAdmissions: [
    //         {
    //           quantity: 190,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: 1,
    //           provinceName: 'Hà Nội',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 16, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"}
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
  ];
  constructor(
    private _modalService: NzModalService,
    private _activatedRoute: ActivatedRoute,
    private _universityService: UniversityService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getUniversityId();
  }

  getMajorBySeason(event: any): void {
    if (!event) {
      return;
    }
    this.getMajorsOfUiversity(1, 10, '1', event, '');
  }

  getUniversityId(): void {
    this._activatedRoute.params.subscribe((param) => {      
      this.uniId = param.id;
      this.getMajorsOfUiversity(1, 10, '1', 9, '');
    });
  }

  getMajorsOfUiversity(pageNumber: number, pageSize: number, uniId:string, seasonId: number, majorName: string): void {
    console.log(uniId);
    this._universityService.getMajorOfUniversity(pageNumber, pageSize, uniId, seasonId, majorName).pipe(
      tap((rs) => {
        console.log(rs);
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfMajors = rs.data;
            this.listOfDisplayMajors = [...this.listOfMajors];  
          } else {
            this.listOfMajors = [];
            this.listOfDisplayMajors = [...this.listOfMajors];  
          }                  
        } else {
          console.log('Load University/Detail Lỗi');
        }
      }),
      catchError((err) => {
        return of(undefined);
      })
    ).subscribe();
  }

  searchByName(): void {
    // this.getMajorsOfUiversity(1, this.pageSize, this.searchValueName);
    this.getMajorsOfUiversity(1, 10, '1', 9, this.searchValueName);
    console.log(this.searchValueName);
  }

  resetSearchName(): void {
    this.searchValueName = '';    
    this.searchByName();
    this.pageIndex = 1;
    this.pageSize = 10;
  }
}
