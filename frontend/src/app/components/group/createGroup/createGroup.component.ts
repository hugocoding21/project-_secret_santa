import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';

@Component({
  selector: 'app-create-group-form',
  templateUrl: './createGroup.component.html',
})
export class createGroupComponent {
  secretSantaForm: FormGroup;

  formFields = {
    name: {
      label: 'Nom du groupe',
      type: 'text',
      required: true,
    },
    santaDate: {
      label: 'Date du Secret Santa',
      type: 'date',
      required: true,
    },
  };

  constructor(
    private fb: FormBuilder,
    private groupHttpClientService: GroupHttpClientService,
    private router: Router
  ) {
    this.secretSantaForm = this.fb.group({
      name: ['', Validators.required],
      santaDate: ['', Validators.required],
    });
  }

  async onSubmit(formData: any): Promise<void> {
    try {
      if (this.secretSantaForm.valid) {
        this.groupHttpClientService.createGroup(formData).subscribe({
          next: (group) => {
            console.log('Group created successfully', group);
            this.router.navigate([`/group/add-member/${group._id}`]);
          },
          error: (err) => {
            console.error(
              'Une erreur est survenue lors de la création du groupe',
              err
            );
          },
        });
      } else {
        console.log('Invalid form');
      }
    } catch (err) {
      console.error(err);
    }
  }
}
