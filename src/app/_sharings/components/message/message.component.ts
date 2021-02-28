import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(private  _dialogRef:  MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public  data:  any) {}

  ngOnInit(): void {
    this._dialogRef.disableClose;
    this._dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
         this._dialogRef.close();
      }, 2000)
    });
  }

}
