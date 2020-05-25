import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, BlogService, ModalService, SearchService, CurrentUserService } from 'services';
import { Router } from '@angular/router';
import { BlogFormComponent } from 'components/blog-form/blog-form.component';
import { NgbdSortableHeaderDirective, SortEvent } from 'app/directives/sortable.directive';
import { pluck, tap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  providers: [SearchService, DecimalPipe]
})
export class FeedComponent implements OnInit {
  isMyPost: boolean;

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: ModalService,
    public search: SearchService,
    private blogService: BlogService,
    private ngxService: NgxUiLoaderService,
    public currentUser: CurrentUserService
  ) {
    this.isMyPost = this.router.url !== '/feed';
  }

  onAdd() {
    this.modalService.openModal(BlogFormComponent).result.then(
      res => {
        this.ngxService.start();
        this.blogService.addBlog({ userId: this.currentUser.currentUserValue, ...res })
          .pipe(
            pluck('data', 'createBlog'),
            tap(() => {
              this.ngxService.stop();
            })
          ).subscribe((response) => {
            this.search.blogs.next([...this.search.getBlogs, response]);
          },
        () => this.ngxService.stop()
        );
      }
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
            })
          )
          .subscribe(
            response => this.search.blogs.next(this.search.getBlogs.map(elem => elem._id === response._id ? response : elem)),
            () => this.ngxService.stop()
            );
      }
    ).catch(err => err);
  }

  onDelete(blogId: string) {
    this.ngxService.start();
    this.blogService.removeBlog({ userId: this.currentUser.currentUserValue, blogId })
      .pipe(
        pluck('data', 'deleteBlog'),
        tap(() => {
          this.ngxService.stop();
        })
      )
      .subscribe(
        response => this.search.blogs.next(this.search.getBlogs.filter(elem => elem._id !== response.blogId)),
        () => this.ngxService.stop()
      );
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.search.sortColumn = column;
    this.search.sortDirection = direction;
  }

  ngOnInit(): void {}
}
