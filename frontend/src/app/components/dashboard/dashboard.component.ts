import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Group } from 'src/models/api/group/groups.model';
import { MembershipHttpClientService } from 'src/app/shared/services/Membership-http-client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title: string = 'Dashboard';
  secretSantas: Array<Group> = [];
  userGroups: Array<Group> = [];

  currentDate: Date = new Date();

  constructor(
    private titleService: Title,
    private groupHttpClientService: GroupHttpClientService,
    private membershipHttpClientService: MembershipHttpClientService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.getOwnedGroup();
  }

  isSantaInProgress(santaDate: string | Date): boolean {
    return new Date(santaDate).getTime() >= this.currentDate.getTime();
  }

  /* Récupere les group créer par l'utilisateur */
  getOwnedGroup(): void {
    this.groupHttpClientService.geOwnerGroup().subscribe(
      (groups: Array<Group>) => {
        this.secretSantas = groups;
      },
      (error: Error) => {
        console.error('Erreur lors de la récupération des groupes', error);
      }
    );
  }
  /* Recupere les groupe ou le user est membre */
  getUserGroup(): void {
    this.groupHttpClientService.getUserGroup().subscribe(
      (groups: Array<Group>) => {
        this.userGroups = groups;
      },
      (error: Error) => {
        console.error('Erreur lors de la récupération des groupes', error);
      }
    );
  }
}
