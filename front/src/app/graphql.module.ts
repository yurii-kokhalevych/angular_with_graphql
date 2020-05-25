import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { environment } from 'environments/environment';
import { onError } from 'apollo-link-error';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CurrentUserService } from 'services/current-user.service';

const uri = environment.apiUrl;
export const createApollo = (httpLink: HttpLink, toastr: ToastrService, router: Router, currentUser: CurrentUserService) => {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext(async (operation, context) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Refresh: refreshToken ? refreshToken : ''
      },
    };
  });
  return {
    link: ApolloLink.from([onError(({ graphQLErrors, networkError }) => {
      let shouldLogout = false;
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          toastr.error(message, `GraphQL error - ${path}`, { timeOut: 3000, closeButton: true, progressBar: true });
          if (message === 'Non Authenticated') {
              shouldLogout = true;
            }
          }
        );
      }
      if (shouldLogout) {
        currentUser.logOff();
      }
      if (networkError) {
        toastr.error(
          `${networkError.message}`,
          `Network error - ${networkError.name}`,
          { timeOut: 3000, closeButton: true, progressBar: true }
          );
      }
    }), basic, auth, httpLink.create({ uri })]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  };
};

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, ToastrService, Router, CurrentUserService],
    },
  ],
})
export class GraphQLModule {}
