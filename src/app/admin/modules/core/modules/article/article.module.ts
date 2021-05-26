import { NgModule } from '@angular/core';
import { ArticleRoutes } from './article.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { ArticleDetailComponent, ArticleMainComponent, PublishedComponent, CensorshipComponent } from './pages';
import { ArticleCardComponent, ArticleContentModalComponent, ArticleGridListComponent, BoardArticleListComponent, SearchByConditionComponent, TopArticleComponent } from './components';
import { SliceWordPipe } from 'src/app/admin/shared/pipe/slice-word.pipe';

const COMPONENTS = [
  ArticleCardComponent,
  BoardArticleListComponent,
  ArticleGridListComponent,
  TopArticleComponent,
  SearchByConditionComponent,
  PublishedComponent,
  ArticleContentModalComponent
];

const PAGES = [
  ArticleMainComponent,
  ArticleDetailComponent,
  CensorshipComponent
];

const PIPE = [
  SliceWordPipe
]
@NgModule({
  imports: [
    SharedModule.forChild(),
    ArticleRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPE]
})
export class ArticleModule { }
