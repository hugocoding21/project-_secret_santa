import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    TagModule,
    RippleModule,
  ],
  exports: [
    FormComponent,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    TagModule,
    RippleModule,
  ],
})
export class SharedModule {}
