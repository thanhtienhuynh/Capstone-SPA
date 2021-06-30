import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { ExaminationService } from 'src/app/admin/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-exam-modal',
  templateUrl: './view-exam-modal.component.html',
  styleUrls: ['./view-exam-modal.component.scss']
})
export class ViewExamModalComponent implements OnInit {

  @Input() data: any;
  @Input() callBack: () => void;  
  @Input() isLoading;
  constructor(
    private _examinationService: ExaminationService,
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }


  createExam(): void {  
    this.isLoading = true;        
    const universityId = this.data.universityId === null ? null : this.data.universityId.id;
    const subjectId = this.data.subjectId === null ? null : this.data.subjectId.id
    const newValue = {...this.data, universityId: universityId, subjectId: subjectId}
    console.log(newValue);
    this._examinationService.createNewExam(newValue).pipe(
      tap(rs => { 
        console.log(rs);       
        if (rs.succeeded === true) {
          this.isLoading = false;
          this.closeModal();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Thành Công',
            showConfirmButton: false,
            timer: 1500
          })          
        } else {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Thành Công',
            // titleText: rs.errors
            showConfirmButton: false,
            timer: 1500
          }) 
        }        
      })
    ).subscribe();    
  }

  closeModal(): void {
    this._modalRef.close();
  }

}
