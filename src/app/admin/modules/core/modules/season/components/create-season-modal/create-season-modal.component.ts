import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { SeasonService } from 'src/app/admin/services/season/season.service';
import { Season } from 'src/app/admin/view-models';

@Component({
  selector: 'app-create-season-modal',
  templateUrl: './create-season-modal.component.html',
  styleUrls: ['./create-season-modal.component.scss']
})
export class CreateSeasonModalComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _seasonService: SeasonService,
    private _modalRef: NzModalRef
  ) { 
    this.initForm();
  }

  isLoading: boolean = false;

  @Input() listOfSeason: Season[];
  @Input() callBack: () => void;

  cloneSeasonId: number = 1000;

  createForm: FormGroup;
  ngOnInit() {
  }

  initForm(): void {
    this.createForm = this._fb.group({
      'name': ['', Validators.required],
      'fromDate': ['', Validators.required],
      'seasonSourceId': [1000, Validators.required]
    })
  }

  createSeason(): void {
    this.isLoading = true;
    const newValue = {
      'name': this.createForm.get('name').value,
      'fromDate': this.createForm.get('fromDate').value,
      'seasonSourceId': this.createForm.get('seasonSourceId').value === 1000 ? null : this.createForm.get('seasonSourceId').value
    }    
    this._seasonService.createSeason(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isLoading = false;
          this.callBack();
          this.closeModal();
        } else {
          this.isLoading = false;
        }
      })
    ).subscribe()
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
