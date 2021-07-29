import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CaringMajorsComponent } from "./caring-majors/caring-majors.component";
import { CaringUniversitiesComponent } from "./caring-universities/caring-universities.component";
import { InformationComponent } from "./information/information.component";
import { TestReviewComponent } from "./test-submissions/test-review/test-review.component";
import { TestSubmissionsComponent } from "./test-submissions/test-submissions.component";
import { FollowingDetailComponent } from "./following-detail/following-detail.component";
import { UserComponent } from "./user.component";

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', pathMatch: 'full', component:  InformationComponent},
      { path: 'test-submissions', component: TestSubmissionsComponent },
      { path: 'test-submissions/detail', component: TestReviewComponent },
      { path: 'information', component: InformationComponent },
      { path: 'caring-majors', component: CaringMajorsComponent },
      { path: 'caring-majors/:id', component: FollowingDetailComponent },
      { path: 'caring-universities', component: CaringUniversitiesComponent },
      { path: 'caring-universities/:id', component: FollowingDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}