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

  async onSubmit(): Promise<void> {
    try {
      if (this.secretSantaForm.valid) {
        console.log(this.secretSantaForm);

        this.groupHttpClientService
          .createGroup(this.secretSantaForm.value)
          .subscribe({
            next: (group) => {
              console.log('Group created successfully', group);
            },
            error: (err) => {
              console.error(
                'Une erreur est survenue lors de la création du groupe',
                err
              );
            },
          });
        this.router.navigate(['/group/add-member'], {
          queryParams: { name: this.secretSantaForm.value.name },
        });
      } else {
        console.log('Invalid form');
      }
    } catch (err) {
      console.error(err);
    }
  }
}
