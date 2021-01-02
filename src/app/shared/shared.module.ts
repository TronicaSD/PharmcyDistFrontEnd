import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbActionsModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbLayoutModule, NbMenuModule, NbMenuService, NbSearchModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbThemeModule, NbThemeService, NbToastrModule } from "@nebular/theme";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenuChildrenComponent } from "./components/menu-children/menu-children.component";
import { TopNavbarComponent } from "./components/top-navbar/top-navbar.component";
import { NumbersOnlyDirective } from "./directives/number-only.directive";

@NgModule({
    declarations: [
      MenuChildrenComponent,
      TopNavbarComponent,
      NumbersOnlyDirective,
    ],
    imports: [

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
     NbToastrModule.forRoot(),
     NbDialogModule.forChild({ closeOnBackdropClick: false, autoFocus: true, closeOnEsc: true ,dialogClass:"defaultdialogue"})
 
    ],
    exports: [
      NbActionsModule,
      NbSearchModule,
     NbThemeModule, // this will enable the default theme, you can change this to `cosmic` to enable the dark theme  
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
     TopNavbarComponent,
  
    ],

    providers: [NbThemeService,NbMenuService,NbSidebarService],
  })
export class SharedModule {}