import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { MajorUniversity } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-major-modal',
  templateUrl: './delete-major-modal.component.html',
  styleUrls: ['./delete-major-modal.component.scss']
})
export class DeleteMajorModalComponent implements OnInit {

  @Input() data: MajorUniversity;
  @Input() changeSeasonId: (seasonId: number) => void;
  @Input() universityName: string;
  @Input() universityId: any;
  majorDetailId: string | number;
  @Input() seasonSelected: number;

  isDeleting: boolean = false;
  constructor(
    private _universityService: UniversityService,
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {
    this.majorDetailId = this.data.majorDetailUnies[0].id;
  }

  filterDataByTrainingProgramId(event: any): void {
    this.majorDetailId = event;
  }

  deleteMajor(): void {
    this.isDeleting = true;
    const newValue = {
      'majorDetailId': this.majorDetailId,
      'status': 0
    }
    this._universityService.majorUpdation(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          Swal.fire('THÀNH CÔNG', 'Cập nhật thành công', 'success');
          this.isDeleting = false;
          this.changeSeasonId(this.seasonSelected);
          this.closeModal();
        } else {
          Swal.fire('LỖI', `${rs.errors[0]}`, 'error');
          this.isDeleting = false;
        }
      })
    ).subscribe();
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
