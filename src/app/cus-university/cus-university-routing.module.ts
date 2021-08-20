import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailUniversityResolver } from "../_resolver/detail-university-resolver.service";
import { CollapseUniversityComponent } from "./collapse-university/collapse-university.component";
import { CusUniversityDetailComponent } from "./cus-university-detail/cus-university-detail.component";
import { CusUniversityComponent } from "./cus-university.component";

const routes: Routes = [
  {
    path: '',
    component: CusUniversityComponent,
    children: [
      { path: '', pathMatch: "full", component: CollapseUniversityComponent},
      { path: ':id', component: CusUniversityDetailComponent, resolve: {university: DetailUniversityResolver}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CusUniversityRoutingModule {}