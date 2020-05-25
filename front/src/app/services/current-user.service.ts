import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { clearStorage, getItemFromStorage } from 'helpers/localStore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class CurrentUserService {
  public currentUserSubject: BehaviorSubject<string>;
  private currentUser: Observable<string>;
  public currentUserAvatarSubject: BehaviorSubject<string>;
  private currentUserAvatar: Observable<string>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<string>(getItemFromStorage('userID'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserAvatarSubject = new BehaviorSubject<string>(getItemFromStorage('avatar'));
    this.currentUserAvatar = this.currentUserAvatarSubject.asObservable();
  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  async logOff() {
    this.currentUserSubject.next(null);
    this.currentUserAvatarSubject.next(null);
    clearStorage();
    await this.router.navigate(['/', 'login']);
  }
}
