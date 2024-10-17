import { GroupHttpClientService } from 'src/app/shared/services/group-http-client.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Group } from 'src/models/api/group/groups.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title: string = 'Dashboard';
  secretSantas: Array<Group> = [];
  currentDate: Date = new Date();

  constructor(
    private titleService: Title,
    private groupHttpClientService: GroupHttpClientService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.getGroup();
  }

  isSantaInProgress(santaDate: string | Date): boolean {
    return new Date(santaDate).getTime() >= this.currentDate.getTime();
  }

  getGroup(): void {
    this.groupHttpClientService.getGroups().subscribe(
      (groups: Array<Group>) => {
        this.secretSantas = groups;
      },
      (error: Error) => {
        console.error('Erreur lors de la récupération des groupes', error);
      }
    );
  }
}
