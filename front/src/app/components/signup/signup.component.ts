import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'services';
import {pluck, tap} from 'rxjs/operators';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private ngxService: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get controls() { return this.signUpForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }
    this.ngxService.start();
    this.authenticationService.register(this.signUpForm.value)
      .pipe(
        pluck('data', 'createUser'),
        tap(() => {
          this.ngxService.stop();
        })
      )
      .subscribe(
        (result) => this.authenticationService.afterLogin(result),
        () => this.ngxService.stop()
      );
  }
}
