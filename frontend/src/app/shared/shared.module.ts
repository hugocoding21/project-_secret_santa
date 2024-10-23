import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [FormComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    TagModule,
    RippleModule,
    InputTextModule,
  ],
  exports: [
    FormsModule,
    FormComponent,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    TagModule,
    RippleModule,
    InputTextModule,
  ],
})
export class SharedModule {}
