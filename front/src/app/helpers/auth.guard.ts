import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CurrentUserService } from 'services/current-user.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private currentUser: CurrentUserService
  ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.currentUser.currentUserValue;
    if (currentUser) {
      // user is authorised
      return true;
    }
    // user is not authorised
    this.router.navigate(['/', 'login']);
    return false;
  }
}
