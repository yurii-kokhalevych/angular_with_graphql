import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { AuthenticationService, CurrentUserService } from 'services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {pluck, tap} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private socialAuthService: AuthService,
    private currentUser: CurrentUserService,
    private ngxService: NgxUiLoaderService,
  ) {
    if (this.currentUser.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get controls() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.ngxService.start();
    this.authenticationService.login(this.loginForm.value)
      .pipe(
        pluck('data', 'login'),
        tap(() => {
          this.ngxService.stop();
        })
      )
      .subscribe(
        (result) => this.authenticationService.afterLogin(result),
              () => this.ngxService.stop()
      );
  }

  signInWithGoogle() {
    const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider)
      .then((userData) => {
        const { name, email, id } = userData;
        this.ngxService.start();
        this.authenticationService.googleSigIn({ name, email, password: id.toString() })
          .pipe(
            pluck('data', 'googleLogin'),
            tap(() => {
              this.ngxService.stop();
            })
          )
          .subscribe(
            (result) => this.authenticationService.afterLogin(result),
            () => this.ngxService.stop()
          );
      });
  }
}
