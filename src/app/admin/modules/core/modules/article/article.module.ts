import { NgModule } from '@angular/core';
import { ArticleRoutes } from './article.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { ArticleDetailComponent, ArticleMainComponent, PublishedComponent, CensorshipComponent } from './pages';
import { ArticleCardComponent, ArticleGridListComponent, BoardArticleListComponent, SearchByConditionComponent, TopArticleComponent } from './components';

const COMPONENTS = [
  ArticleCardComponent,
  BoardArticleListComponent,
  ArticleGridListComponent,
  TopArticleComponent,
  SearchByConditionComponent,
  PublishedComponent
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
