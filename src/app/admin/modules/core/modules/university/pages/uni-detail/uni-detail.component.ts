import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { MajorUniversity, UniversityRM } from 'src/app/admin/view-models';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { ActionMajorModalComponent, CreateMajorModalComponent } from '../../components';
@Component({
  selector: 'app-uni-detail',
  templateUrl: './uni-detail.component.html',
  styleUrls: ['./uni-detail.component.scss']
})
export class UniDetailComponent implements OnInit {  

  isVisibleHeader = 0;
  mediaSub: Subscription;

  seasonSelected = 9;

  uniId: string;
  visible = false;
  searchValueName: string = '';
  total = 100;
  pageSize = 10;
  pageIndex = 1;

  updateUniForm: FormGroup;

  university: UniversityRM = {
    logoUrl: 'https://cdn.24h.com.vn/upload/2-2021/images/2021-05-31/Gan-30-nghin-can-bo-y-te-sinh-vien-Y-Duoc-da-co-mat-tai-tam-dich-Bac-Giang-nhan-luc-1622450472-177-width640height480.jpg'
  }

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
    //           provinceName: null,
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"}, 
    //             {id: 105, mark: 20, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"},   
    //             {id: 105, mark: 20, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"},  
    //             {id: 105, mark: 20, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"},  
    //             {id: 105, mark: 20, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"},  
    //             {id: 105, mark: 20, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"},               
    //           ]
    //         },
    //         {
    //           quantity: 300,
    //           admissionMethodId: 1, 
    //           admissionMethodName: null,
    //           genderId: 0,
    //           provinceName: 'Hà Nội',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 18, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 16, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
    //             {id: 105, mark: 20, majorSubjectGoupId: 312, subjectGroupId: 53, subjectGroupCode: "D01"},                                    
    //           ]
    //         }            
    //       ]
    //     },
    //     {
    //       trainingProgramName: 'Chất lượng cao tiếng anh',
    //       majorDetailCode: "7810208",
    //       admissionQuantity: 200,
    //       majorDetailSubAdmissions: [
    //         {
    //           quantity: 190,
    //           admissionMethodId: 1, 
    //           admissionMethodName: "THPT QG",
    //           genderId: 0,
    //           provinceName: 'Hà Nội',
    //           majorDetailEntryMarks : [
    //             {id: 97, mark: 16, majorSubjectGoupId: 308, subjectGroupId: 1, subjectGroupCode: "A00"},
    //             {id: 101, mark: 30, majorSubjectGoupId: 310, subjectGroupId: 27, subjectGroupCode: "C00"},
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
    private _fb: FormBuilder,
    public _mediaObserver: MediaObserver    
  ) {
    this.initUpdateUniForm();
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.getUniversityId();
    this.getUniversityById();    
  }

  scroll = (event): void => {
    if (event.target.scrollTop > 420) {
      this.isVisibleHeader = event.target.scrollTop;
    } else {
      this.isVisibleHeader = 0;
    }
  }

  initUpdateUniForm(): void {
    this.updateUniForm = this._fb.group({
      'name': ['', Validators.required],
      'code': ['', Validators.required],
      'address': ['', Validators.required],
      'phone': ['', Validators.required],
      'webUrl': ['', Validators.required],
      'tuitionType': [''],
      'tuitionFrom': [''],
      'tuitionTo': [''],
      'description': ['', Validators.required],
      'rating': [1],
      'status': [0],
    });
  }
  

  getUniversityId(): void {
    this._activatedRoute.params.subscribe((param) => {
      this.uniId = param.id;
      this.getMajorsOfUiversity(1, 10, param.id, 9, '');
    });
  }

  getUniversityById(): void {
    this._activatedRoute.params.subscribe((param) => {
      this._universityService.getUniversityById(param.id).pipe(
        tap((rs) => {
          // console.log(rs);
          this.uniId = param.id;
          this.university = rs.data;
          this.setDataToForm(this.university);
        }),
        catchError((err) => {
          return of(undefined);
        })
      ).subscribe();
    });
  };

  setDataToForm(university: UniversityRM): void {
    this.updateUniForm.get('name').setValue(university.name.toLocaleUpperCase());
    this.updateUniForm.get('code').setValue(university.code);
    this.updateUniForm.get('address').setValue(university.address.toLocaleUpperCase());
    this.updateUniForm.get('description').setValue(university.description);
    this.updateUniForm.get('phone').setValue(university.phone);
    this.updateUniForm.get('webUrl').setValue(university.webUrl.toLocaleUpperCase());
    this.updateUniForm.get('tuitionType').setValue(university.tuitionType);
    this.updateUniForm.get('tuitionFrom').setValue(university.tuitionFrom);
    this.updateUniForm.get('tuitionTo').setValue(university.tuitionTo);
    this.updateUniForm.get('status').setValue(university.status);
    this.updateUniForm.get('rating').setValue(university.rating);
  };

  getMajorBySeason(event: any): void {
    if (!event) {
      return;
    }    
    this.getMajorsOfUiversity(1, 10, this.uniId, event, '');
  }
  

  getMajorsOfUiversity(pageNumber: number, pageSize: number, uniId: string, seasonId: number, majorName: string): void {        
    this._universityService.getMajorOfUniversity(pageNumber, pageSize, uniId, seasonId, majorName).pipe(
      tap((rs) => {        
        if (rs.succeeded === true) {          
          console.log(rs, 'Uni detail component');
          if (rs.data !== null) {   
            console.log('Hàm đã được thự thi');                     
            this.listOfMajors = rs.data;
            this.listOfDisplayMajors = [...rs.data];
            this.total = rs.totalRecords;    
            console.log(this.listOfDisplayMajors, this.total, 'trong if');                    
          } else {
            this.listOfMajors = [];
            this.listOfDisplayMajors = [];
            console.log(this.listOfDisplayMajors, 'đang ở trong else');
            this.total = rs.totalRecords;
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
    this.getMajorsOfUiversity(1, 10, this.uniId, 9, this.searchValueName);    
  }

  resetSearchName(): void {
    this.searchValueName = '';
    this.searchByName();
    this.pageIndex = 1;
    this.pageSize = 10;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.getMajorsOfUiversity(params.pageIndex, params.pageSize, this.uniId, 9, this.searchValueName);    
  }

  tracking(index, majorDetailUni): number {    
    return 2;
  }  
  //Modal
  openCreateMajorModal(data: MajorUniversity | undefined): void {    
    const modal = this._modalService.create({
      nzContent: ActionMajorModalComponent,
      // nzContent: CreateMajorModalComponent,
      nzClosable: true,      
      nzFooter: null,
      nzWidth: 800,         
      nzComponentParams: {data: data, universityId: this.uniId, universityName: this.university.name,    
        listOfMajor: this.listOfMajors, 
        callBack: (abc: number) => { this.getMajorsOfUiversity(1, 10, this.uniId, abc, '') }, //Cách này (cái này chạy và load lại trang đc)
        // callBack2: this.getMajorsOfUiversity , // Với cách này rồi qua bên ActionMajorModalComponent mới truyền param vào thì có khác nhau k anh? (còn thằng này thì e test vẫn chạy đc, nhưng méo load lại đc)        
      },      
    });
    modal.afterClose.pipe(
      tap((rs) => {
        // this.seasonSelected = 1
        // this.getMajorBySeason(this.seasonSelected)
        
      })
    ).subscribe();
  }

}
