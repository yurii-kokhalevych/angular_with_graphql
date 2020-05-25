import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, SignupComponent, NotFoundComponent, FeedComponent, ProfileComponent, BlogDetailsComponent } from 'app/components';
import { AuthGuard } from 'app/helpers';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'my-feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'my-feed/:id', pathMatch: 'full', component: BlogDetailsComponent, canActivate: [AuthGuard] },
  { path: 'feed/:id', pathMatch: 'full', component: BlogDetailsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'feed', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent },
];

export const routing = RouterModule.forRoot(routes);
