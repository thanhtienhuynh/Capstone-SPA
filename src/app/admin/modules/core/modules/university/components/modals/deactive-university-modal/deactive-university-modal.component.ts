import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { UniversityRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deactive-university-modal',
  templateUrl: './deactive-university-modal.component.html',
  styleUrls: ['./deactive-university-modal.component.scss']
})
export class DeactiveUniversityModalComponent implements OnInit {

  @Input() data: UniversityRM;
  @Input() callBack: () => void;
  @Input() action: string;
  
  isLoadingSaving: boolean = false;  
  constructor(    
    private _modalRef: NzModalRef,
    private _universityService: UniversityService
  ) {     
  }

  ngOnInit() {
    if (this.data !== undefined) {      
    }
  }

  updateUni(): void {
    this.isLoadingSaving = true;
    const newValue = {
      ...this.data,
      'status': this.action === 'deactive' ? 0 : 1,
      'file': this.data.file
    }
    const formData = new FormData();
    for (let key in newValue) {
      formData.append(key, newValue[key]);
    }
    this._universityService.updateUniversity(formData).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          this.isLoadingSaving = false;  
          this.callBack();
          Swal.fire('Thành công', 'Cập nhật thành công', 'success');  
          this.closeModal();                              
        } else {
          this.isLoadingSaving = false;
          Swal.fire('Lỗi', 'Cập nhật thất bại', 'error');
        }
      }),
      catchError((err) => {
        return of(undefined);
      })
    ).subscribe();
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
