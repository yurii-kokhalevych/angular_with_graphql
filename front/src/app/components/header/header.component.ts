import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, CurrentUserService } from 'services';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'blog';
  hide = true;
  img = '';
  hideSubscription: Subscription;
  avatarSubscriptions: Subscription;

  constructor( private authenticationService: AuthenticationService, private currentUser: CurrentUserService) {
    this.hideSubscription  = this.currentUser.currentUserSubject.subscribe(
      value => this.hide = !!value
    );
    this.avatarSubscriptions = this.currentUser.currentUserAvatarSubject.subscribe(
      value => this.img = value
    );
  }

  ngOnInit(): void {}

  onLogOut() {
    this.authenticationService.logout();
  }

  ngOnDestroy() {
    this.hideSubscription.unsubscribe();
    this.avatarSubscriptions.unsubscribe();
  }
}
