import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IFilters, IBlog } from 'models';
import { BehaviorSubject, Subject } from 'rxjs';
import {debounceTime, pluck, switchMap, tap} from 'rxjs/operators';
import { AuthenticationService } from 'services/authentication.service';
import { CurrentUserService } from 'services/current-user.service';
import { BlogService } from 'services/blog.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SortDirection } from 'app/directives/sortable.directive';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  public search = new Subject<void>();
  public blogs = new BehaviorSubject<IBlog[]>([]);
  public loading = new BehaviorSubject<boolean>(true);
  private isMyPost = new BehaviorSubject<boolean>(true);
  private filter: IFilters = {
    searchTitle: '',
    searchDescription: '',
    searchCreator: '',
    searchCreatedAt: '',
    sortColumn: '',
    sortDirection: '',
  };

  throttle = 150;
  scrollDistance = 2;
  constructor(
    private pipe: DecimalPipe,
    private blogService: BlogService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private currentUser: CurrentUserService,
  ) {
    this.isMyPost.next(this.router.url !== '/feed');
    this.search.pipe(
      tap(() => {
        this.loading.next(true);
        this.ngxService.start();
      }),
      debounceTime(200),
      switchMap(() => this.onSearch(this.limit)),
      tap(() => {
        this.loading.next(false);
        this.ngxService.stop();
      }),
      pluck('data', 'filterBlogs')
    ).subscribe(result => {
      this.blogs.next(result);
    });

    this.search.next();
  }

  limit = 10;

  get searchTitle() { return this.filter.searchTitle; }
  get searchDescription() { return this.filter.searchDescription; }
  get searchCreator() { return this.filter.searchCreator; }
  get searchCreatedAt() { return this.filter.searchCreatedAt; }
  get getBlogs() { return this.blogs.value; }
  get getLoading() { return this.loading.value; }

  set searchTitle(searchTitle: string) { this._set({ searchTitle }); }
  set searchDescription(searchDescription: string) { this._set({ searchDescription }); }
  set searchCreator(searchCreator: string) { this._set({ searchCreator }); }
  set searchCreatedAt(searchCreatedAt: any) { this._set({ searchCreatedAt }); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<IFilters>) {
    Object.assign(this.filter, patch);
    this.search.next();
  }

  private onSearch(limit) {
    const { searchTitle, searchDescription, searchCreator, searchCreatedAt, sortColumn, sortDirection } = this.filter;
    if (searchCreatedAt && typeof searchCreatedAt !== 'object') {
      this.toastr.error('Invalid date format', `Input error`, { timeOut: 3000, closeButton: true, progressBar: true });
      return;
    }
    const userId = this.isMyPost.value ? this.currentUser.currentUserValue : '';
    return this.blogService.filterResponse({
        title: searchTitle,
        description: searchDescription,
        userName: searchCreator,
        createdAt: searchCreatedAt,
        userId,
        sortColumn,
        sortDirection,
        limit,
      }).valueChanges;
  }

  onScrollDown() {
    this.limit += 10;
    this.onSearch(this.limit).subscribe((result: any) => {
      const newValue = this.blogs.value.concat(result.data.filterBlogs);
      this.blogs.next(newValue);
    });
  }
}
