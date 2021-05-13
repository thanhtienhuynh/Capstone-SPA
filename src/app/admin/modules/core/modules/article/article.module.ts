import { NgModule } from '@angular/core';
import { ArticleRoutes } from './article.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { ArticleDetailComponent, ArticleMainComponent } from './pages';
import { CensorshipComponent } from './pages/censorship/censorship.component';
import { ArticleCardComponent, BoardArticleListComponent } from './components';

const COMPONENTS = [
  ArticleCardComponent,
  BoardArticleListComponent
];

const PAGES = [
  ArticleMainComponent,
  ArticleDetailComponent,
  CensorshipComponent
];

@NgModule({
  imports: [
    SharedModule.forChild(),
    ArticleRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class ArticleModule { }
