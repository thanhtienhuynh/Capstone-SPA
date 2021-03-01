import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-answers',
  templateUrl: './list-answers.component.html',
  styleUrls: ['./list-answers.component.scss']
})
export class ListAnswersComponent implements OnInit, OnChanges {

  @Input() questions: any;
  @Input() selectedIndex: number;  
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {    
  }

}
