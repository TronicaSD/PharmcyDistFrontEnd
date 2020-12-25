import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.css']
})
export class SidebarRightComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  log: any;

  constructor(private _loginService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this._loginService.isLoggedIn;
    debugger;
  }

}
