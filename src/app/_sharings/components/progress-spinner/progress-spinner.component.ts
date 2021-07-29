import { Component, Input, OnInit } from '@angular/core';
import { Action } from '@ngrx/store';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {
  @Input() actions: Action[];
  constructor() { }

  ngOnInit() {
  }

}
