import { Component, Input  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from 'services';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss']
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  constructor() {}

  get errorMessage() {
    if (this.control && this.control.errors) {
      for (const propertyName in this.control.errors) {
        if (
          this.control.errors.hasOwnProperty(propertyName) &&
          this.control.touched
        ) {
          return ValidationService.getValidatorErrorMessage(
            propertyName,
            this.control.errors[propertyName]
          );
        }
      }
    }
    return null;
  }
}
