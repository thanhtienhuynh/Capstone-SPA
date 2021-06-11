import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { InformationComponent } from "./information/information.component";
import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../_sharings/shared.module";
import { TestSubmissionsComponent } from "./test-submissions/test-submissions.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TestReviewComponent } from "./test-submissions/test-review/test-review.component";
import { CaringMajorsComponent } from "./caring-majors/caring-majors.component";
import { CaringUniversitiesComponent } from "./caring-universities/caring-universities.component";
import { FollowingDetailComponent } from "./following-detail/following-detail.component";

@NgModule({
  declarations: [
    UserComponent,
    InformationComponent,
    TestSubmissionsComponent,
    TestReviewComponent,
    CaringMajorsComponent,
    CaringUniversitiesComponent,
    FollowingDetailComponent
  ],
  imports: [
    RouterModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
  ]
})
export class UserModule {}