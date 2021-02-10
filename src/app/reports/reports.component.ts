import { Component, OnInit } from '@angular/core';
import { NbLayoutDirection, NbLayoutDirectionService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/services/auth.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  
  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  private destroy$: Subject<void> = new Subject<void>();
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },

  ];

  currentTheme = 'dark';
  currentLanguage = 'ar';
  constructor(private themeService: NbThemeService, private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    public translate: TranslateService,
    private _coockieService: CookieService,
    private _authService: AuthService,
    private _dirService :NbLayoutDirectionService

  ) {
    this.themeService.onThemeChange()
      .subscribe((theme: any) => {
        console.log(`Theme changed to ${theme.name}`);
      });
  }
  
  ngOnInit(): void {
   let lang= this._coockieService.get('language');

    this._dirService.setDirection(lang=="ar"?NbLayoutDirection.RTL:NbLayoutDirection.LTR);
    this.currentTheme = this.themeService.currentTheme;

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }
  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    this._coockieService.set('language', lang);
  this._dirService.setDirection(lang=="ar"?NbLayoutDirection.RTL:NbLayoutDirection.LTR);

  }
  logOut() {
   
    this._authService.logout();
  }

}