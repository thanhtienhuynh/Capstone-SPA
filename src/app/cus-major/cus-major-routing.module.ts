import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollapseMajorComponent } from "./collapse-major/collapse-major.component";
import { CusMajorComponent } from "./cus-major.component";

const routes: Routes = [
  {
    path: '',
    component: CusMajorComponent,
    children: [
      { path: '', component: CollapseMajorComponent},
      // { path: ':id', component: DetailArticleComponent, resolve: {article: DetailArticleResolver} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CusMajorRoutingModule {}