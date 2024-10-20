import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  memberForm: FormGroup;
  groupName: string | null = null; // Pour stocker le nom du groupe

  constructor(
    private fb: FormBuilder,
    private groupHttpClientService: GroupHttpClientService,
    private route: ActivatedRoute // Injecter ActivatedRoute pour accéder aux paramètres de la requête
  ) {
    this.memberForm = this.fb.group({
      emails: this.fb.array([]),
    });
    this.addEmailField();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.groupName = params['name']; // Récupérer le nom du groupe des paramètres
    });
  }

  get emails(): FormArray {
    return this.memberForm.get('emails') as FormArray;
  }

  createEmailGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addEmailField() {
    this.emails.push(this.createEmailGroup());
  }

  removeEmailField(index: number) {
    this.emails.removeAt(index);
  }

  submit() {
    if (this.memberForm.valid) {
      const body = {
        receivers: this.memberForm.value.emails.map(
          (emailGroup: any) => emailGroup.email
        ),
        groupName: this.groupName,
      };

      this.groupHttpClientService.sendEmailInvitation(body).subscribe();
    } else {
      console.error('Form is invalid');
    }
  }
}
