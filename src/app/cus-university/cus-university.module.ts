import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../_sharings/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CusUniversityRoutingModule } from "./cus-university-routing.module";
import { CollapseUniversityComponent } from "./collapse-university/collapse-university.component";
import { CusUniversityDetailComponent } from "./cus-university-detail/cus-university-detail.component";

@NgModule({
  declarations: [
    CollapseUniversityComponent,
    CusUniversityDetailComponent
  ],
  imports: [
    RouterModule,
    CusUniversityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
  ]
})
export class CusUniversityModule {}