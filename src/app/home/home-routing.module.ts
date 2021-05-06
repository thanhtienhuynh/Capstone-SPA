import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailArticleResolver } from "../_resolver/detail-article-resolver.service";
import { CollapseArticleComponent } from "./collapse-article/collapse-article.component";
import { DetailArticleComponent } from "./detail-article/detail-article.component";
import { HomeComponent } from "./home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: CollapseArticleComponent},
      { path: ':id', component: DetailArticleComponent, resolve: {article: DetailArticleResolver} },
      // { path: 'test-submissions/detail', component: TestReviewComponent },
      // { path: 'information', component: InformationComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}