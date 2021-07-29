import { NgModule } from '@angular/core';
import { ArticleRoutes } from './article.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { ArticleDetailComponent, ArticleMainComponent, PublishedComponent, CensorshipComponent, ArticleMainFatherComponent, CreateArticleComponent } from './pages';
import { ArticleCardComponent, ArticleContentModalComponent, ArticleGridListComponent, BoardArticleListComponent, ReviewCreateArticleModalComponent, SearchByConditionComponent, TopArticleComponent, UpdateArticleComponent } from './components';
import { SliceWordPipe } from 'src/app/admin/shared/pipe/slice-word.pipe';
import { SafeArticleHtmlPipe } from 'src/app/admin/shared/pipe';


const COMPONENTS = [
  ArticleCardComponent,
  BoardArticleListComponent,
  ArticleGridListComponent,
  TopArticleComponent,
  SearchByConditionComponent,
  PublishedComponent,
  ArticleContentModalComponent,
  UpdateArticleComponent,
  ReviewCreateArticleModalComponent
];

const PAGES = [
  ArticleMainComponent,
  ArticleMainFatherComponent,
  ArticleDetailComponent,
  CensorshipComponent,
  CreateArticleComponent
];

const PIPE = [
  SliceWordPipe,   
  SafeArticleHtmlPipe
]

@NgModule({
  imports: [
    SharedModule.forChild(),
    ArticleRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPE]
})
export class ArticleModule { }
