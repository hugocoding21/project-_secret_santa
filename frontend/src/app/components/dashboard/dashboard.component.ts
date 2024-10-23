import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';
import { Title } from '@angular/platform-browser';
import { Component, Injector, OnInit } from '@angular/core';
import { Group } from 'src/models/api/group/groups.model';
import { MembershipHttpClientService } from 'src/app/shared/services/Membership-http-client.service';
import { Router } from '@angular/router';
import { AppController } from '@app/app.controller';
import { AuthService } from '@app/shared/services/auth-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends AppController implements OnInit {
  title: string = 'Dashboard';
  secretSantas: Array<Group> = [];
  userGroups: Array<Group> = [];
  pendingInvitations: Array<any> = [];

  currentDate: Date = new Date();
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private successTimeout: any;

  constructor(
    inject: Injector,
    authService: AuthService,
    private titleService: Title,
    private router: Router,
    private groupHttpClientService: GroupHttpClientService
  ) {
    super(inject, authService);
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.getGroups(true); //owned groups
    this.getGroups();
    this.getInvitations();
  }

  isSantaInProgress(santaDate: string | Date): boolean {
    return new Date(santaDate).getTime() >= this.currentDate.getTime();
  }

  getInvitations() {
    this.groupHttpClientService.getInvitations(this.user.id).subscribe({
      next: (data: any) => {
        this.pendingInvitations=[];
        if (data.length>0) {
          this.pendingInvitations = data;
        }
      },
      error: (error) => {
        console.error(error);
        this.successMessage = null;
        this.errorMessage = error.error.message;
      },
    });
  }

  /* Récupere les group créer par l'utilisateur */
  getGroups(owner: boolean = false): void {
    this.groupHttpClientService.getGroups(owner).subscribe({
      next: (data: any) => {
        if (owner) {
          this.secretSantas = data;
        } else {
          this.userGroups = data;
        }
      },
      error: (error) => {
        console.error(error);
        this.successMessage = null;
        this.errorMessage = error.error.message;
      },
    });
  }

  editGroup(groupId: string): void {
    this.router.navigate(['/group/view', groupId]);
  }

  addMembers(id: string): void {
    this.router.navigate([`/group/add-member/${id}`]);
  }

  deleteSanta(id: any) {
    this.groupHttpClientService.deleteSantaAssignement(id).subscribe({
      next: (data: any) => {
        this.handleSuccess(data, true);
      },
      error: (error) => {
        console.error(error);
        this.successMessage = null;
        this.errorMessage = error.error.message;
      },
    });
  }
  launchSanta(id: any) {
    this.groupHttpClientService.launchSecretSanta(id).subscribe({
      next: (data) => {
        this.handleSuccess(data);
      },
      error: (error) => {
        console.error(error);
        this.successMessage = null;
        this.errorMessage = error.error.message;
      },
    });
  }

  handleSuccess(data: any, owned: boolean = false) {
    this.successMessage = data.message;
    this.errorMessage = null;

    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
    this.successTimeout = setTimeout(() => {
      this.successMessage = null;
    }, 3000);
    this.getGroups(true);
  }

  manageInvitation(groupId: string, type: string) {
    if (type === 'accept') {
      this.handleInvitation(groupId,type);
    } else {
      if (confirm("Êtes-vous sûr de vouloir décliner l'invitation à ce groupe ?")) {
        this.handleInvitation(groupId,type);
      }
    }
  }
   handleInvitation(groupId:string,type:string) {
    this.groupHttpClientService.manageInvitations(groupId, this.user.id, type)
      .subscribe({
        next: (data) => {
          this.getInvitations();
          this.getGroups();
          this.handleSuccess(data);
        },
        error: (error) => {
          console.error(error);
          this.successMessage = null;
          this.errorMessage = error.error.message;
        },
      });
  };
  
}
