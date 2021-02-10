import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbActionsModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbMenuService, NbSearchModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbThemeModule, NbThemeService, NbToastrModule, NbToggleModule } from "@nebular/theme";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { MenuChildrenComponent } from "./components/menu-children/menu-children.component";
import { NumbersOnlyDirective } from "./directives/number-only.directive";

@NgModule({
    declarations: [
      MenuChildrenComponent,
      NumbersOnlyDirective,
    ],
    imports: [
      FormsModule,
     NbMenuModule.forRoot(),
     NbLayoutModule,
     NbActionsModule,
     NbSearchModule,
     NbSelectModule,
     NbSidebarModule,
     NbCardModule,
     NgbModule,
     NbFormFieldModule,
     NbButtonModule,
     NbDatepickerModule.forRoot(),
     NbEvaIconsModule,
     NbIconModule,
     TranslateModule,
     NbToastrModule.forRoot(),
     NbDialogModule.forChild({ closeOnBackdropClick: false, autoFocus: true, 
      closeOnEsc: true ,dialogClass:"defaultdialogue"}),
     Ng2SmartTableModule,
     NbToggleModule
    ],
    exports: [
     NbActionsModule,
     NbSearchModule,
     NbInputModule,
     NbLayoutModule,
     NbSidebarModule,
     NbMenuModule,
     NbCardModule,
     NgbModule,
     NbFormFieldModule,
     NbSelectModule,
     NbButtonModule,
     NbDatepickerModule,
     NbEvaIconsModule,
     NbIconModule,
     NbToastrModule,
     NbDialogModule,
     NumbersOnlyDirective,
     MenuChildrenComponent,
     Ng2SmartTableModule,
     TranslateModule,
     NbToggleModule
  
    ],

    providers: [NbThemeService,NbMenuService,NbSidebarService],
  })
export class SharedModule {}