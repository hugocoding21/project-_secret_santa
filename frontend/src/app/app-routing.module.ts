import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { createGroupComponent } from './components/group/createGroup/createGroup.component';
import { AddMemberComponent } from './components/group/addMember/add-member/add-member.component';
import { UpdateGroupComponent } from './components/group/updateGroup/update-group/update-group.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './guards/auth.guard';
import { GroupAccessGuard } from './guards/group-access.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige vers home si la route est vide
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [AuthGuard], // AuthGuard s'applique à toutes les routes enfants
    children: [
      { path: 'profile', component: ProfilComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'group/add', component: createGroupComponent },
      { path: 'group/add-member/:id', component: AddMemberComponent },
      { path: 'group/view/:id', component: UpdateGroupComponent,canActivate: [GroupAccessGuard], },
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // Redirige toute autre route vers home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
