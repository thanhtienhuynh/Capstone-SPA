import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailMajorResolver } from "../_resolver/detail-major-resolver.service";
import { CollapseMajorComponent } from "./collapse-major/collapse-major.component";
import { CusMajorDetailComponent } from "./cus-major-detail/cus-major-detail.component";
import { CusMajorComponent } from "./cus-major.component";

const routes: Routes = [
  {
    path: '',
    component: CusMajorComponent,
    children: [
      { path: '', component: CollapseMajorComponent},
      { path: ':id', component: CusMajorDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CusMajorRoutingModule {}