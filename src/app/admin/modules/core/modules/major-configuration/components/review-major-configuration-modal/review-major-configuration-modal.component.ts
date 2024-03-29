import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { MajorConfigurationService } from 'src/app/admin/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-major-configuration-modal',
  templateUrl: './review-major-configuration-modal.component.html',
  styleUrls: ['./review-major-configuration-modal.component.scss']
})
export class ReviewMajorConfigurationModalComponent implements OnInit {

  @Input() data: any;
  @Input() subjectGroups: any;
  @Input() update: () => void;
  @Input() callPlace: string;

  isUpdateLoading: boolean = false;
  isCreateLoading: boolean = false;
  constructor(
    private _majorConfigService: MajorConfigurationService,
    private _modalRef: NzModalRef,
  ) {

  }

  ngOnInit() {
  }

  updateMajorToSystem(): void {
    this.isUpdateLoading = true;
    this._majorConfigService.updateMajorToSystem(this.data).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isUpdateLoading = false;
          Swal.fire('Thành công', 'Cập nhật thành công', 'success');
          this.update();
          this.closeModal();
        } else {
          this.isUpdateLoading = false;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }

      })
    ).subscribe()
  }

  createMajorToSystem(): void {
    this.isCreateLoading = true;
    this._majorConfigService.addNewMajorToSystem(this.data).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isCreateLoading = false;
          Swal.fire('Thành công', 'Thêm ngành mới vào hệ thống thành công', 'success');
          this.update();
          this.closeModal();
        } else {
          this.isCreateLoading = false;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
