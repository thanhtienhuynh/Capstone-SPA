import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) { 

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((param) => {
      console.log(param);
    });
  }

  useUpdate(): void {    
    this.router.navigate(['admin/core/article/details/3']);      
  }

}
