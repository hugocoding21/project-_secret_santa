import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FormComponent, ReactiveFormsModule],
})
export class SharedModule {}
