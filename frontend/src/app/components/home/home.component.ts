import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  features = [
    { title: 'Inscrivez-vous', description: 'Créez un compte ou connectez-vous.' },
    { title: 'Formez un groupe', description: 'Invitez vos amis à participer.' },
    { title: 'Tirez au sort', description: 'Chaque participant se verra attribuer un autre participant à qui offrir un cadeau.' },
    { title: 'Fêtez ensemble', description: 'Échangez vos cadeaux lors d\'une fête ou d\'un événement spécial.' },
  ];
  
}
