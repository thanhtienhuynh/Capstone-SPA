import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InformationComponent } from "./information/information.component";
import { TestReviewComponent } from "./test-submissions/test-review/test-review.component";
import { TestSubmissionsComponent } from "./test-submissions/test-submissions.component";
import { UserComponent } from "./user.component";

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', pathMatch: 'full', component:  InformationComponent},
      { path: 'test-submissions', component: TestSubmissionsComponent },
      { path: 'test-submissions/:id', component: TestReviewComponent },
      { path: 'information', component: InformationComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}