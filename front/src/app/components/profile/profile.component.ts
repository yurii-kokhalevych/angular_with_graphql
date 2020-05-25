import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, ModalService, UserService, CurrentUserService} from 'services';
import { pluck, tap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  loading = false;
  profileInfo = {
    name: '',
    email: '',
    avatar: '',
  };
  modalReference = null;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private modalService: ModalService,
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private currentUser: CurrentUserService
  ) {}

  get controls() { return this.profileForm.controls; }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
    this.ngxService.start();
    this.loading = true;
    this.userService.getProfile(this.currentUser.currentUserValue).valueChanges
      .pipe(
        pluck('data', 'user'),
        tap(() => {
          this.ngxService.stop();
        })
      )
      .subscribe(result => {
          this.loading = false;
          this.profileInfo = result;
          this.currentUser.currentUserAvatarSubject.next(result.avatar);
          this.profileForm.setValue({
            username: result.name,
            email: result.email,
          });
          this.loading = false;
      },
        () => this.ngxService.stop()
      );
  }

  onSubmit(closeModal) {
    this.submitted = true;
    this.loading = true;
    this.ngxService.start();

    // stop if form is invalid
    if (this.profileForm.invalid) {
      this.loading = false;
      return;
    }
    this.userService.updateUser({
      userId: this.currentUser.currentUserValue,
      avatar: this.profileInfo.avatar,
      email: this.profileForm.value.email,
      name: this.profileForm.value.username,
    })
      .pipe(
        tap(async () => {
          await this.ngxService.stop();
        }),
        pluck('data', 'updateUser')
      )
      .subscribe(async result => {
          this.profileInfo = result;
          await this.currentUser.currentUserAvatarSubject.next(result.avatar);
          this.profileForm.setValue({
            username: result.name,
            email: result.email,
          });
        },
        () => this.ngxService.stop()
      );
    this.loading = false;
    closeModal();
  }

  processFile(img) {
    const file: File = img.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.profileInfo.avatar = event.target.result;
    });

    reader.readAsDataURL(file);
  }

  open(content) {
    this.modalReference = this.modalService.openModal(content).result;
  }

}
