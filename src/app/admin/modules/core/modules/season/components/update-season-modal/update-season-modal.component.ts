import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { SeasonService } from 'src/app/admin/services/season/season.service';
import { Season } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-season-modal',
  templateUrl: './update-season-modal.component.html',
  styleUrls: ['./update-season-modal.component.scss']
})
export class UpdateSeasonModalComponent implements OnInit {

  @Input() callBack: () => void;
  @Input() action: string;
  @Input() season: Season
  @Input() listOfSeason: Season[];

  isLoading: boolean = false;
  updateForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _seasonService: SeasonService,
    private _modalRef: NzModalRef
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.setDataToForm();
  }

  initForm(): void {
    this.updateForm = this._fb.group({
      'id': ['', Validators.required],
      'name': ['', Validators.required],
      'fromDate': ['', Validators.required],
      'status': [0, Validators.required]
    });
  }

  setDataToForm(): void {
    if (this.action === 'delete') {
      this.updateForm.get('id').setValue(this.season.id);
      this.updateForm.get('name').setValue(this.season.name);
      this.updateForm.get('fromDate').setValue(this.season.fromDate);
      this.updateForm.get('status').setValue(0);
    }
    if (this.action === 'edit') {
      this.updateForm.get('id').setValue(this.season.id);
      this.updateForm.get('name').setValue(this.season.name);
      this.updateForm.get('fromDate').setValue(this.season.fromDate);
      this.updateForm.get('status').setValue(1);
    }
  }

  updateSeason(): void {
    this.isLoading = true;
    const newValue = {
      'id': this.updateForm.get('id').value,
      'name': this.updateForm.get('name').value,
      'fromDate': this.updateForm.get('fromDate').value,
      'status': this.updateForm.get('status').value
    }
    this._seasonService.updateSeason(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isLoading = false;
          Swal.fire('Thành công', 'Cập nhật thành công', 'success');
          this.callBack();
          this.closeModal();
        } else {
          Swal.fire('Lỗi', `${rs.errors}`, 'error');
          this.isLoading = false;
        }
      })
    ).subscribe()
  }

  closeModal(): void {
    this._modalRef.close();
  }

}
