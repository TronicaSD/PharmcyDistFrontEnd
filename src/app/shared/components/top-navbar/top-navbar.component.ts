import { Component, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
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
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';
  constructor(private themeService: NbThemeService,private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
        ) {
    this.themeService.onThemeChange()
          .subscribe((theme: any) => {
            console.log(`Theme changed to ${theme.name}`);
          });
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

}
