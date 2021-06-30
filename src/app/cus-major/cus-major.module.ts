import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../_sharings/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../admin/shared/shared.module";
import { CollapseMajorComponent } from "./collapse-major/collapse-major.component";
import { CusMajorRoutingModule } from "./cus-major-routing.module";

@NgModule({
  declarations: [
    CollapseMajorComponent
  ],
  imports: [
    RouterModule,
    CusMajorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
  ]
})
export class CusMajorModule {}