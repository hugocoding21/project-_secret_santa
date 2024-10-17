import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface FormField {
  label: string;
  type: string;
  required?: boolean;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() formTitle: string = 'Form';
  @Input() formFields: { [key: string]: FormField } = {};
  @Input() submitButtonText: string = 'Submit';
  @Output() formSubmitted = new EventEmitter<any>();

  @Input() formGroup!: FormGroup; 

  objectKeys = Object.keys;

  ngOnInit() {
    
  }

  onSubmit() {
    console.log(this.formGroup);
    
    if (this.formGroup.valid) {
      this.formSubmitted.emit(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
