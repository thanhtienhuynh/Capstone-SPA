import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-university-detail-modal',
  templateUrl: './university-detail-modal.component.html',
  styleUrls: ['./university-detail-modal.component.scss']
})
export class UniversityDetailModalComponent implements OnInit {

  @Input() universityId: number;
  constructor() { }

  ngOnInit() {
  }

}
