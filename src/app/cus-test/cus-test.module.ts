import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../_sharings/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../admin/shared/shared.module";
import { CusTestRoutingModule } from "./cus-test-routing.module";
import { CollapseTestComponent } from "./collapse-test/collapse-test.component";
import { CusTestSubjectComponent } from "./cus-test-subject/cus-test-subject.component";
import { CusTestDetailComponent } from "./cus-test-detail/cus-test-detail.component";
import { CountdownModule } from "ngx-countdown";

@NgModule({
  declarations: [
    CollapseTestComponent,
    CusTestSubjectComponent,
    CusTestDetailComponent
  ],
  imports: [
    CountdownModule,
    RouterModule,
    CusTestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
  ]
})
export class CusTestModule {}