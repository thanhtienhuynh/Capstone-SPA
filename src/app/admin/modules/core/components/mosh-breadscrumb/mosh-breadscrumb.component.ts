import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mosh-breadscrumb',
  templateUrl: './mosh-breadscrumb.component.html',
  styleUrls: ['./mosh-breadscrumb.component.scss']
})
export class MoshBreadscrumbComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {    
  }

}
