import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { MajorUniversity, Season, UniversityRM } from 'src/app/admin/view-models';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { ActionMajorModalComponent, CreateMajorModalComponent, DeleteMajorModalComponent } from '../../components';
import Swal from 'sweetalert2';
import { quillConfiguration } from 'src/app/admin/config';
@Component({
  selector: 'app-uni-detail',
  templateUrl: './uni-detail.component.html',
  styleUrls: ['./uni-detail.component.scss']
})
export class UniDetailComponent implements OnInit {  

  isVisibleHeader = 0;
  mediaSub: Subscription;
  editorOptions = quillConfiguration;

  seasonSelected;
  listOfSeason: Season[] = [];

  uniId: string;
  visible = false;
  searchValueName: string = '';
  logo: string | ArrayBuffer;
  image: File;
  total = 100;
  pageSize = 10;
  pageIndex = 1;

  updateUniForm: FormGroup;

  university: UniversityRM = {}

  listOfMajors: MajorUniversity[];
  listOfDisplayMajors: MajorUniversity[] = [
    
  ];
  
  constructor(
    private _modalService: NzModalService,    
    private _universityService: UniversityService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public _mediaObserver: MediaObserver    
  ) {
    this.initUpdateUniForm();
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);    
    this.getUniversityById();  
    this.getListOfSeason();
  }

  scroll = (event): void => {
    if (event.target.scrollTop > 420) {
      this.isVisibleHeader = event.target.scrollTop;
    } else {
      this.isVisibleHeader = 0;
    }
  }

  getListOfSeason(): void {
    this._universityService.getListOfSeason().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.listOfSeason = [...rs.data];
          this.seasonSelected = rs.data[1].id;          
          this._activatedRoute.params.subscribe((param) => {    
            this.getMajorsOfUiversity(1, 10, param?.id, this.seasonSelected, '');          
          });          
        } else {

        }
      }),
      catchError(err => {
        return of(undefined);
      })
    ).subscribe();
  }

  initUpdateUniForm(): void {
    this.updateUniForm = this._fb.group({
      'name': ['', Validators.required],
      'code': ['', Validators.required],
      'address': ['', Validators.required],
      'phone': ['', Validators.required],
      'webUrl': ['', Validators.required],
      'tuitionType': ['', Validators.required],
      'tuitionFrom': ['', Validators.required],
      'tuitionTo': ['', Validators.required],
      'description': ['', Validators.required],
      'rating': [1],
      'status': [0],
    });
  }
    

  getUniversityById(): void {
    this._activatedRoute.params.subscribe((param) => {
      this.uniId = param.id;
      this._universityService.getUniversityById(param.id).pipe(
        tap((rs) => {                    
          if (rs.succeeded === true) {
            this.university = rs.data;
            this.setDataToForm(this.university);
          } else {

          }          
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
    this.seasonSelected = event;
    this.getMajorsOfUiversity(1, 10, this.uniId, event, '');
  }
  

  getMajorsOfUiversity(pageNumber: number, pageSize: number, uniId: string, seasonId: number, majorName: string): void {   
    console.log('uniId', uniId, 'seasonId', seasonId);     
    this._universityService.getMajorOfUniversity(pageNumber, pageSize, uniId, seasonId, majorName).pipe(
      tap((rs) => {        
        if (rs.succeeded === true) {                    
          if (rs.data !== null) {                                
            this.listOfMajors = rs.data;
            this.listOfDisplayMajors = [...rs.data];
            this.total = rs.totalRecords;                                 
          } else {
            this.listOfMajors = [];
            this.listOfDisplayMajors = [];            
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
    console.log(this.seasonSelected);   
    this.getMajorsOfUiversity(1, 10, this.uniId, this.seasonSelected, this.searchValueName);    
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
    if (this.uniId !== undefined && this.seasonSelected !== undefined) {      
      this.getMajorsOfUiversity(params.pageIndex, params.pageSize, this.uniId, this.seasonSelected, this.searchValueName);   
    }     
  }
    
  changeSelectedSeason(seasonId: number): void {
    console.log(seasonId, 'changeSelectedSeason');    
    this.seasonSelected = seasonId  
    this.getMajorBySeason(seasonId);  
    this.pageIndex = 1;
    this.pageSize = 10;
  }
  openCreateMajorModal(data: MajorUniversity | undefined): void {    
    const modal = this._modalService.create({
      nzContent: ActionMajorModalComponent,      
      nzClosable: false,      
      nzFooter: null,
      nzWidth: 800,         
      nzComponentParams: {data: data, universityId: this.uniId, universityName: this.university.name,    
        listOfMajor: this.listOfMajors,         
        changeSeasonId: (seasonId: number) => { this.changeSelectedSeason(seasonId) }
      },      
    });
    modal.afterClose.pipe(
      tap((rs) => {            
      })
    ).subscribe();
  }

  
  uploadLogo(evt): void {    
    const files: File[] = evt.target.files;
    console.log(files);
    if (files.length > 1) {
      Swal.fire('Lỗi', 'Chỉ được chọn 1 file', 'error');
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
          this.image = files[0];                  
        } else {
          Swal.fire('Oversize', 'Vui lòng chọn ảnh có kích thước từ 2MB trở xuống', 'error');
        }
      } else {
        Swal.fire('Lỗi', 'Vui lòng chỉ chọn file ảnh (.png, .jpeg, .jpg)', 'error');
      }
    }    
  }

  removeFile(): void {
    this.logo = undefined;    
    this.image = null;
  }

  updateUni(): void {
    const newValue = {
      "id": Number.parseInt(this.uniId),
      "code": this.updateUniForm.get('code').value,
      "name": this.updateUniForm.get('name').value,
      "address": this.updateUniForm.get('address').value,
      "file": this.image ? this.image : null,
      "description": this.updateUniForm.get('description').value,
      "phone": this.updateUniForm.get('phone').value,
      "webUrl": this.updateUniForm.get('webUrl').value,
      "tuitionType": Number.parseInt(this.updateUniForm.get('tuitionType').value),
      "tuitionFrom": Number.parseInt(this.updateUniForm.get('tuitionFrom').value),
      "tuitionTo": Number.parseInt(this.updateUniForm.get('tuitionTo').value),
      "rating": this.updateUniForm.get('rating').value,
      "status": this.updateUniForm.get('status').value
    }  
    console.log(newValue);
    const formData = new FormData();     
    for (let key in newValue) {
      formData.append(key, newValue[key]);
    }
    Swal.fire({
      title: 'Bạn có muốn lưu những thông tin đã thay đổi hay không?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Lưu`,
      denyButtonText: `Không lưu`,
      cancelButtonText: `Thoát`      
    }).then((result) => {
      if (result.isConfirmed) {
        this._universityService.updateUniversity(formData).pipe(
          tap((rs) => {            
            if (rs.succeeded === true) {
              Swal.fire('Thành Công', 'Cập nhật thành công', 'success');              
            } else {
              Swal.fire('Thành Công', 'Cập nhật thất bại', 'success');    
            }      
          }),
          catchError((err) => {                       
            return of(undefined);
          })
        ).subscribe();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }  

  openDeleteMajorModal(data: MajorUniversity | undefined): void {    
    const modal = this._modalService.create({
      nzContent: DeleteMajorModalComponent,      
      nzClosable: false,      
      nzFooter: null,
      nzWidth: 800,         
      nzComponentParams: {data: data, changeSeasonId: (seasonId: number) => { this.changeSelectedSeason(seasonId) },
        universityId: this.uniId, universityName: this.university.name, seasonSelected: this.seasonSelected
      },      
    });
    modal.afterClose.pipe(
      tap((rs) => {            
      })
    ).subscribe();
  }
}
