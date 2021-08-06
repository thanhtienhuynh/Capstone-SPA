import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { UserConfigurationService } from 'src/app/admin/services/users-configuration/user-configuration.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.scss']
})
export class UpdateUserModalComponent implements OnInit {

  @Input() data: User;
  @Input() callBack: () => void;

  isLoading: boolean = false;

  userForm: FormGroup
  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _userService: UserConfigurationService
  ) { 
    this.initUserForm();
  }

  ngOnInit() {
    if (this.data !== undefined) {
      this.setDataToForm(this.data);
    }
  }

  initUserForm(): void {
    this.userForm = this._fb.group({
      'id': [''],
      'isActive': [''],
      'role': ['']
    })
  }

  setDataToForm(data: User): void{
    this.userForm.get('id').setValue(data.id);
    this.userForm.get('isActive').setValue(data.isActive);
    this.userForm.get('role').setValue(data.roleId);
  }

  update(): void {
    this.isLoading = true;
    const newValue = {
      'id': this.userForm.get('id').value,
      'isActive': this.userForm.get('isActive').value,
      'role': this.userForm.get('role').value
    }    
    this._userService.updateUser(newValue).pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoading = false;
          this.callBack();
          this.closeModal();
        } else {
          this.isLoading = false;
        }
      })
    ).subscribe();
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
