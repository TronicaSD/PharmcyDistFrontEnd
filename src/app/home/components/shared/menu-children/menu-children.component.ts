import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'nb-menu-children',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-children.component.html',
})
export class MenuChildrenComponent {

  items: NbMenuItem[] = [
    {
      title: 'Home',
      link: '/home'
    },
    {
      title: 'Basic Info',
      expanded: false,
      children: [
        {
          title: 'Drugs',
          link: 'home/drugs'
        },

      ],
    }

  ];
}