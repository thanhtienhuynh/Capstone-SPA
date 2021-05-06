import { NgModule } from '@angular/core';
import { ArticleRoutes } from './article.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { ArticleDetailComponent, ArticleMainComponent } from './pages';

const COMPONENTS = [

];

const PAGES = [
  ArticleMainComponent,
  ArticleDetailComponent
];

@NgModule({
  imports: [
    SharedModule.forChild(),
    ArticleRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class ArticleModule { }
