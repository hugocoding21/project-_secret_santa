import { MembershipHttpClientService } from './../../../../shared/services/Membership-http-client.service';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';
import { Group } from 'src/models/api/group/groups.model';
import { AppController } from '@app/app.controller';
import { AuthService } from '@app/shared/services/auth-service';

@Component({
  selector: 'app-update-group',
  templateUrl: './update-group.component.html',
  styleUrls: ['./update-group.component.scss'],
})
export class UpdateGroupComponent extends AppController implements OnInit {
  groupId: string = '';
  groupData: any;
  groupMembers: any;
  pendingInvitations: any[] = [];
  groupForm: FormGroup;
  santaAssigned: boolean =false;
  isGroupOwner: boolean = false;

  constructor(
    inject: Injector, authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private groupHttpClientService: GroupHttpClientService,
    private membershipHttpClientService: MembershipHttpClientService,
  ) {
    super(inject, authService);
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      santaDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.groupHttpClientService.isGroupOwner$.subscribe((isOwner) => {
      this.isGroupOwner = isOwner;      
    });
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    this.loadGroupData();
  }

  updateGroup(): void {
    if (this.groupForm.valid) {
      const updatedGroup: Group | any = {
        name: this.groupForm.value.name,
        santaDate: this.groupForm.value.santaDate,
      };

      this.groupHttpClientService
        .updateGroup(this.groupId, updatedGroup)
        .subscribe(
          (response) => {
            console.log('Group updated successfully', response);
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error('Error updating group', error);
          }
        );
    } else {
      console.log('Invalid form');
    }
  }

  loadGroupData(): void {
    this.groupHttpClientService.getGroupById(this.groupId).subscribe(
      (data) => {
        this.santaAssigned=data.santaAssigned;
        this.groupData = data;
        const formattedSantaDate = new Date(data.santaDate)
          .toISOString()
          .split('T')[0];
        this.groupForm.patchValue({
          name: data.name,
          santaDate: formattedSantaDate,
        });
      },
      (error) => {
        console.error('Error loading group data', error);
      }
    );

    this.membershipHttpClientService.getMembersOfGroup(this.groupId).subscribe(
      (data) => {
        console.log(data);
        
        this.groupMembers = data.filter(
          (member: any) => (member.invitedMail ||member.invitedMail == null || member.invitedMail ==='') && member.isAccepted === true
        );
    
        this.pendingInvitations = data.filter(
          (invitation: any) => invitation.invitedMail != null && invitation.isAccepted === false
        );
      },
      (error) => {
        console.error('Error loading group data', error);
      }
    );
  }
  isDeclineOrPending(invite:any){
    return invite.invitedMail && invite.invitedMail.trim() !== '' && invite.isAccepted === false;
    
  }

  removeMember(memberId: string): void {
    this.membershipHttpClientService
      .removeMember(this.groupId, memberId)
      .subscribe(
        (response) => {
          console.log('Member removed successfully', response);
          this.groupMembers = this.groupMembers.filter(
            (member: any) => member?.userId._id !== memberId
          );
        },
        (error) => {
          console.error('Error removing member', error);
        }
      );
  }

  removeInvite(invitedMail: string): void {
    this.membershipHttpClientService
      .removeMember(this.groupId, invitedMail)
      .subscribe(
        () => {
          this.pendingInvitations = this.pendingInvitations.filter(
            (member: any) => member.invitedMail !== invitedMail
          );
        },
        (error) => {
          console.error('Error removing member:', error);
          this.pendingInvitations = this.pendingInvitations.filter(
            (member: any) => member.invitedMail !== invitedMail
          );
        }
      );
  }

  deleteGroup(): void {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.'
      )
    ) {
      this.groupHttpClientService.deleteGroup(this.groupId).subscribe(
        (response: Response) => {
          console.log('Group deleted successfully', response);
          this.router.navigate(['/dashboard']);
        },
        (error: Error) => {
          console.error('Error deleting group', error);
        }
      );
    }
  }

  getValidGroupMembers() {    
    return this.groupMembers?.filter((member: any) => member.userId) || [];
  }

  hasValidMembers(): boolean {
    return this.getValidGroupMembers().length > 0;
  }

  toggleAssociationVisibility(index: number): void {

    const userId=this.groupMembers[index].userId._id;
    this.groupHttpClientService.showAssociationByMembersId(this.groupId,userId).subscribe({
      next: (data: any) => { 
        if (data) {
          this.groupMembers[index].showAssociation = !this.groupMembers[index].showAssociation;
          this.groupMembers[index].associatedWith = data.username;
        }       
      },
      error: (error) => {
        console.error(error);
        this.groupMembers[index].showAssociation=false;
      }
    });
  }
}
