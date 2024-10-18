import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-group-form',
  templateUrl: './createGroup.component.html',
})
export class createGroupComponent {
  secretSantaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.secretSantaForm = this.fb.group({
      groupName: ['', Validators.required],
      santaDate: ['', Validators.required],
      emails: this.fb.array([this.createEmailField()]),
    });
  }

  get emails(): FormArray {
    return this.secretSantaForm.get('emails') as FormArray;
  }

  createEmailField(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addEmail(): void {
    this.emails.push(this.createEmailField());
  }

  removeEmail(index: number): void {
    if (this.emails.length > 1) {
      this.emails.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.secretSantaForm.valid) {
      console.log('Form Data:', this.secretSantaForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }
}
