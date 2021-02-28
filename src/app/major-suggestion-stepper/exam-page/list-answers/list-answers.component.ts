import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-answers',
  templateUrl: './list-answers.component.html',
  styleUrls: ['./list-answers.component.scss']
})
export class ListAnswersComponent implements OnInit {

  @Input() questions: any;

  isSelected: boolean = false;
  constructor() { }

  ngOnInit(): void {
    console.log(this.questions);
  }

}
