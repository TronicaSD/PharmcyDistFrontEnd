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
      title: 'Basic information',
      link: '/home',

      expanded: false,
      children: [
        {
          title: 'Drugs',
          link: 'drugs'
        },
        {
          title: 'Pharmcies',
          link: 'pharmcies'
        },
      
      ],
    },
    {
      title: 'Stock',
      link: '/home',

      expanded: false,
      children: [
        {
          title: 'Stock Details',
          link: 'stockDetails'
        }
      ],
    },
    {
      title: 'Operations',
      link: '/home',

      expanded: false,
      children: [
        {
          title: 'Samples',
          link: 'Samples'
        },
        {
          title: 'Invoice',
          link: 'Invoice'
        },
      ],
    },

  ];
}