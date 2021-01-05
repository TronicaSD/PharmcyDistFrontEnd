import { Component, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

  currentTheme = 'default';
  constructor(private themeService: NbThemeService, private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    public translate: TranslateService,
    private _coockieService: CookieService,

  ) {
    this.themeService.onThemeChange()
      .subscribe((theme: any) => {
        console.log(`Theme changed to ${theme.name}`);
      });
    translate.addLangs(['ar', 'en']);
    translate.setDefaultLang('ar');
  }

  ngOnInit(): void {
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
  }

}
