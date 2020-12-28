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
      title: 'Config',
      link: '/home',

      expanded: true,
      children: [
        {
          title: 'Drugs',
          link: 'drugs'
        },
        {
          title: 'Pharmcies',
          link: 'pharmcies'
        },
        {
          title: 'Stock Details',
          link: 'stockDetails'
        },

        {
          title: 'Samples',
          link: 'Samples'
        },
        {
          title: 'Invoice',
          link: 'Invoice'
        },
      ],
    }

  ];
}