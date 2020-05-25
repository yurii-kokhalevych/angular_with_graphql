import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss']
})

export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  submitted = false;
  @Input() public blog;

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
    if (this.blog) {
      this.blogForm.setValue({
        title: this.blog.title,
        description: this.blog.description
      });
    }
  }

  get controls() { return this.blogForm.controls; }

}
