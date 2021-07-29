import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanDeactivateGuard } from "../_helper/can-deactivate-guard.service";
import { TestSubjectGuard } from "../_helper/test-subject.guard";
import { CollapseTestComponent } from "./collapse-test/collapse-test.component";
import { CusTestDetailComponent } from "./cus-test-detail/cus-test-detail.component";
import { CusTestSubjectComponent } from "./cus-test-subject/cus-test-subject.component";
import { CusTestComponent } from "./cus-test.component";

const routes: Routes = [
  {
    path: '',
    component: CusTestComponent,
    children: [
      { path: '', component: CusTestSubjectComponent},
      { path: ':subject-name', canActivate: [TestSubjectGuard], component: CollapseTestComponent},
      { path: ':subject-name/:id', component: CusTestDetailComponent, canDeactivate: [CanDeactivateGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CusTestRoutingModule {}