import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipHttpClientService } from '@app/shared/services/Membership-http-client.service';
import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  memberForm: FormGroup;
  groupId: string = '';
  groupName: string = '';
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private groupHttpClientService: GroupHttpClientService,
    private membershipHttpClientService: MembershipHttpClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getIdParams();
    this.memberForm = this.fb.group({
      emails: this.fb.array([]),
    });
    this.addEmailField();
  }

  ngOnInit(): void {
    this.loadGroupData(this.groupId);
  }

  getIdParams() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('id') || '';
    });
  }

  loadGroupData(id: string) {
    this.groupHttpClientService.getGroupById(id).subscribe(
      (data) => {
        this.groupName = data.name;
      },
      (err) => {
        console.error(err);
        this.router.navigate(['/dashboard']);
      }
    );
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

  async submit() {
    if (this.memberForm.valid) {
      const body = {
        receivers: this.memberForm.value.emails.map(
          (emailGroup: any) => emailGroup.email
        ),
        groupName: this.groupName,
        groupId: this.groupId,
      };

      try {
        await this.membershipHttpClientService
          .addMembers(this.groupId, {
            email: body.receivers,
            groupName: this.groupName,
          })
          .toPromise();

        try {
          await this.groupHttpClientService
            .sendEmailInvitation(body)
            .toPromise();
          this.router.navigate(['/dashboard']);
        } catch (emailError: any) {
          console.error('Error sending email invitations:', emailError);
          alert('Error sending email invitations. Please try again.');
        }
      } catch (addMemberError: any) {
        if (
          addMemberError.status === 400 &&
          addMemberError.error &&
          addMemberError.error.errors
        ) {
          const errorMessage = addMemberError.error.errors
            .map((err: any) => err.message)
            .join(', ');
          console.error('Error adding members:', errorMessage);
          alert(`Error adding members: ${errorMessage}`);
        } else {
          console.error(
            'Unexpected error while adding members:',
            addMemberError
          );
          alert(
            'An unexpected error occurred while adding members. Please try again.'
          );
        }
      }
    } else {
      console.error('Form is invalid');
      alert('Please fill in all required fields.');
    }
  }
}
