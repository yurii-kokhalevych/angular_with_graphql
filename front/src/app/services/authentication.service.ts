import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { IRegister, ILogin, IGoogleLogin } from 'app/models';
import { REGISTRATION_MUTATION, LOGIN_QUERY, GOOGLE_LOGIN_QUERY } from 'app/graphqlTypes';
import { CurrentUserService } from 'services/current-user.service';
import { removeItemFromStorage, setItemFromStorage } from 'helpers';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(private apollo: Apollo, private router: Router, private currentUser: CurrentUserService) {}

  register({ email, password, username }) {
    return this.apollo
    .mutate<IRegister>({
      mutation: REGISTRATION_MUTATION,
      variables: {
        email,
        password,
        name: username
      }
    });
  }

  login({ email, password }) {
    return this.apollo
    .watchQuery<ILogin>({
      query: LOGIN_QUERY,
      variables: {
        email,
        password
      }
    })
    .valueChanges;
  }

  googleSigIn({ email, password, name }) {
    return this.apollo
    .watchQuery<IGoogleLogin>({
      query: GOOGLE_LOGIN_QUERY,
      variables: {
        name,
        email,
        password
      }
    })
    .valueChanges;
  }



  async afterLogin({ token, userId, refreshToken, avatar }) {
    await setItemFromStorage('token', token);
    await setItemFromStorage('userID', userId);
    await setItemFromStorage('refreshToken', refreshToken);
    await setItemFromStorage('avatar', avatar);
    await this.currentUser.currentUserSubject.next(userId);
    await this.currentUser.currentUserAvatarSubject.next(avatar);
    await this.router.navigate(['/', 'feed']);
  }

  async logout() {
    this.currentUser.currentUserSubject.next(null);
    this.currentUser.currentUserAvatarSubject.next(null);
    removeItemFromStorage('token');
    removeItemFromStorage('userID');
    removeItemFromStorage('refreshToken');
    removeItemFromStorage('avatar');
    await this.router.navigate(['/', 'login']);
  }
}

