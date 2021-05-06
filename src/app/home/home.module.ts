import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../_sharings/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomeRoutingModule } from "./home-routing.module";
import { DetailArticleComponent } from "./detail-article/detail-article.component";
import { CollapseArticleComponent } from "./collapse-article/collapse-article.component";

@NgModule({
  declarations: [
    CollapseArticleComponent,
    DetailArticleComponent,
  ],
  imports: [
    RouterModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule
  ]
})
export class HomeModule {}