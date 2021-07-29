import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/admin/services/data/shared-data.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private router: Router,
    private _sharedDataService: SharedDataService
  ) { }

  url: string;

  ngOnInit() {
    this.url = this.router.url;    
    console.log(this.url);
    // this._sharedDataService.currentMessage.subscribe(message => this.url = message)
  }


  useUpdate(link?: string): void {
    if(link){
      this.router.navigate(['admin/core/' + link]);    
    }    
  }
}
