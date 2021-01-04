import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { AuthGuard } from 'src/app/auth/services/auth.guard';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Role } from 'src/app/home/enums/roles';

@Component({
  selector: 'nb-menu-children',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-children.component.html',
})
export class MenuChildrenComponent {
  UserRoles: any = '';

  constructor(private _AuthService: AuthService) {
  }

  findRole(allowedRoles: any) {
    this.UserRoles = this._AuthService.getUserRole();

    if (allowedRoles == this.UserRoles) {
      return true;
    } else {
      debugger;
      return false;

    }
  }
  items: NbMenuItem[] = [

    {
      title: 'Basic information',
      link: '/home',
      icon: 'menu',
      hidden: !(this.findRole(Role.admin)),
      expanded: false,
      children: [
        {
          title: 'Drugs',
          link: 'drugs',
          icon: 'menu',
        },
        {
          title: 'Pharmcies',
          link: 'pharmcies',
          icon: 'menu',

        }
      ],
    },
    {
      title: 'Stock',
      link: '/home',
      icon: 'checkmark',
      hidden: !(this.findRole(Role.admin)),
      expanded: false,
      children: [
        {
          title: 'Stock Details',
          link: 'stockDetails',
          icon: 'checkmark',

        }
      ],
    },
    {
      title: 'Operations',
      link: '/home',
      icon: 'keypad',
      hidden: !(this.findRole(Role.user)),

      expanded: false,
      children: [
        {
          title: 'Samples',
          link: 'Samples',
          icon: 'list',

        },
        {
          title: 'Invoice',
          link: 'Invoice',
          icon: 'list',

        },
      ],
    },

  ];


}