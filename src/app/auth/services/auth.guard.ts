import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private auth: AuthService) {


  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {


    let shouldShow: boolean = false;

    if (this.auth.isAuthenticated()) {
      if (next.data.roles[0] && next.url[0].path != "change-password") {
        let userRole = this.auth.getUserRole();

        if (userRole == next.data.roles[0]) {
          shouldShow = true;
          return true;
        }
        else {

          window.alert('You don\'t have permission to view this page');
          shouldShow = false;

          this.router.navigate(["home"]);
        }
      } else {

        this.router.navigate(["login"]);
      }
    } else {
      this.auth.logout();
    }

  }
}
