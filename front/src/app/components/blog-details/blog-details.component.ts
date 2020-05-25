import { Component, OnInit } from '@angular/core';
import { AuthenticationService, ModalService, BlogService, UserService, CurrentUserService } from 'services';
import { Router } from '@angular/router';
import {pluck, tap} from 'rxjs/operators';
import { BlogFormComponent } from 'components/blog-form/blog-form.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blogs: any[];
  isMyPost: boolean;
  id: string;

  constructor(
    private blogService: BlogService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private modalService: ModalService,
    private ngxService: NgxUiLoaderService,
    private currentUser: CurrentUserService,
  ) {
    this.id = this.router.url.split('/')[2];
    this.isMyPost = this.router.url.split('/')[1] !== 'feed';
  }

  getBlog() {
    this.ngxService.start();
    this.blogService.getBlog(this.id).valueChanges
      .pipe(
        pluck('data', 'blog'),
        tap(() => {
          this.ngxService.stop();
        }))
      .subscribe(
        result => {
          this.blogs = [result];
        },
        () => this.ngxService.stop()
      );
  }

  getOwnBlog() {
    this.ngxService.start();
    this.userService.getUserBlogs(this.currentUser.currentUserValue).valueChanges
      .pipe(
        pluck('data', 'user'),
        tap(() => {
          this.ngxService.stop();
        }))
      .subscribe(result => {
        this.blogs = result.blogList.filter(elem => elem._id === this.id);
      },
        () => this.ngxService.stop()
      );
  }

  onEdit(post) {
    const modalReference = this.modalService.openModal(BlogFormComponent);
    modalReference.componentInstance.blog = post;
    modalReference.result.then(
      res => {
        this.ngxService.start();
        return this.blogService.updateBlog({ blogId: post._id, ...res })
          .pipe(
            pluck('data', 'updateBlog'),
            tap(() => {
              this.ngxService.stop();
            }))
          .subscribe(
            (response) => this.blogs = [response],
            () => this.ngxService.stop()
          );
      }
    );
  }

  onDelete(blogId: string) {
    this.ngxService.start();
    this.blogService.removeBlog({ userId: this.currentUser.currentUserValue, blogId })
      .pipe(pluck('data', 'deleteBlog'),
        tap(() => {
          this.ngxService.stop();
        }))
      .subscribe(
        () => this.router.navigate(['my-feed']),
        () => this.ngxService.stop()
      );
  }

  ngOnInit(): void {
    this.isMyPost ? this.getOwnBlog() : this.getBlog();
  }
}
