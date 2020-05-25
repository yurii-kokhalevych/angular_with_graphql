import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import {
  LoginComponent,
  HeaderComponent,
  FooterComponent,
  FeedComponent,
  ProfileComponent,
  BlogFormComponent,
  SignupComponent,
  NotFoundComponent,
  ControlMessagesComponent,
  BlogDetailsComponent
} from 'app/components';
import { provideConfig } from 'getAuthServiceConfigs';
import { GraphQLModule } from 'graphql.module';
import { AppComponent } from 'app.component';
import { AuthGuard } from 'app/helpers';
import { routing } from 'app/app.route';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgbdSortableHeaderDirective } from 'app/directives/sortable.directive';
import { TruncatePipe } from 'app/format.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    NotFoundComponent,
    FeedComponent,
    ProfileComponent,
    BlogFormComponent,
    ControlMessagesComponent,
    BlogDetailsComponent,
    NgbdSortableHeaderDirective,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule.pick(allIcons),
    ToastrModule.forRoot(),
    NgbModule,
    SocialLoginModule,
    GraphQLModule,
    NgxUiLoaderModule,
    FormsModule,
    InfiniteScrollModule,
    routing,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    NgbActiveModal,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
