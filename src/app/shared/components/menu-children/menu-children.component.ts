import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from 'src/app/auth/services/auth.guard';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Role } from 'src/app/home/enums/roles';

@Component({
  selector: 'nb-menu-children',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-children.component.html',
})
export class MenuChildrenComponent implements OnInit {
  UserRoles: any = '';
  currentLang: string;
  columnheaders: string[] = [];

  constructor(private _AuthService: AuthService,
    public translate: TranslateService,
    private _coockieService: CookieService
    , private _changeDetectorRef: ChangeDetectorRef) {
    var lang = this._coockieService.get('language');
    debugger;
    this.translate.use(lang);
    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });
  }
  ngOnInit(): void {
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {

    this.columnheaders = []
    this.translate.get('Config').subscribe(label => this.columnheaders[0] = label);
    this.translate.get('Drugs').subscribe(label => this.columnheaders[1] = label);
    this.translate.get('Pharmcies').subscribe(label => this.columnheaders[2] = label);
    this.translate.get('Stocks').subscribe(label => this.columnheaders[3] = label);
    this.translate.get('StockDetails').subscribe(label => this.columnheaders[4] = label);
    this.translate.get('InvoiceAndSamples').subscribe(label => this.columnheaders[5] = label);
    this.translate.get('Samples').subscribe(label => this.columnheaders[6] = label);
    this.translate.get('Invoices').subscribe(label => { this.columnheaders[7] = label;
      this.GetMenueItem();
    });
  }
  findRole(allowedRoles: any) {
    this.UserRoles = this._AuthService.getUserRole();

    if (allowedRoles == this.UserRoles) {
      return true;
    } else {

      return false;

    }
  }
  items: NbMenuItem[];
  GetMenueItem() {
    this.items = [

      {
        title: this.columnheaders[0],
        link: '/home',
        icon: 'settings-2-outline',
        hidden: !(this.findRole(Role.admin)),
        expanded: false,
        children: [
          {
            title: this.columnheaders[1],
            link: 'drugs',
                icon: 'drag',
          },
          {
            title: this.columnheaders[2],
            link: 'pharmcies',
              icon: 'drug',

          }
        ],
      },
      {
        title: this.columnheaders[3],
        link: '/home',
        icon: 'home',
        hidden: !(this.findRole(Role.admin)),
        expanded: false,
        children: [
          {
            title: this.columnheaders[4],
            link: 'stockDetails',
                icon: 'home',

          }
        ],
      },
      {
        title: this.columnheaders[5],
        link: '/home',
        icon: 'edit-2-outline',
        hidden: !(this.findRole(Role.user)),

        expanded: false,
        children: [
          {
            title: this.columnheaders[6],
            link: 'Samples',

          },
          {
            title: this.columnheaders[7],
            link: 'Invoice',

          },
        ],
      },

    ];
  }



}