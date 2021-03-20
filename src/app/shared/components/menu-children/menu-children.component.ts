import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from 'src/app/auth/services/auth.guard';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Role } from 'src/app/shared/enums/roles';

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
    this.translate.get('Receipts').subscribe(label => this.columnheaders[5] = label);
    this.translate.get('Inventory').subscribe(label => this.columnheaders[6] = label);
    this.translate.get('InvoiceAndSamples').subscribe(label => this.columnheaders[7] = label);

    this.translate.get('Samples').subscribe(label => this.columnheaders[8] = label);
    this.translate.get('Invoices').subscribe(label => this.columnheaders[9] = label);
    this.translate.get('Governments').subscribe(label => this.columnheaders[10] = label);
    this.translate.get('Cities').subscribe(label => this.columnheaders[11] = label);
    this.translate.get('Doctors').subscribe(label => this.columnheaders[12] = label);
    this.translate.get('ExpensesType').subscribe(label => this.columnheaders[13] = label);
    this.translate.get('Expenses').subscribe(label => {
      this.columnheaders[14] = label;
      this.GetMenueItem();
    });
  }
  findRole(allowedRoles: any[]) {
    this.UserRoles = this._AuthService.getUserRole();

    if (allowedRoles.includes(this.UserRoles)) {

      return false;
    } else {

      return true;
    }
  }
  items: NbMenuItem[];
  GetMenueItem() {
    this.items = [

      {
        title: this.columnheaders[0],
        link: '/home',
        icon: 'settings-2-outline',
        hidden: (this.findRole([Role.admin])),
        expanded: true,
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

          },
          {
            title: this.columnheaders[10],
            link: 'countries',
            icon: 'drug',

          }
          ,
          {
            title: this.columnheaders[11],
            link: 'cities',
            icon: 'drug',

          },
          {
            title: this.columnheaders[12],
            link: 'doctors',
            icon: 'drug',

          },
          {
            title: this.columnheaders[13],
            link: 'ExpenseType',
            icon: 'drug',

          },
          {
            title: this.columnheaders[14],
            link: 'Expense',
            icon: 'drug',

          }
        ],
      },
      {
        title: this.columnheaders[3],
        link: '/home',
        icon: 'home',
        hidden: (this.findRole([Role.agent])),
        expanded: false,
        children: [
          {
            title: this.columnheaders[4],
            link: 'StocktDetails',

          },
          {
            title: this.columnheaders[5],
            link: 'receiptDetails',

          },

        ],
      },
      {
        title: this.columnheaders[7],
        link: '/home',
        icon: 'edit-2-outline',
        hidden: (this.findRole([Role.agent])),

        expanded: false,
        children: [

          {
            title: this.columnheaders[8],
            link: 'Samples',

          },
          {
            title: this.columnheaders[9],
            link: 'Invoice',

          },
          {
            title: this.columnheaders[6],
            link: 'Inventroy',

          }
        ],
      },

    ];
  }



}