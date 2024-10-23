import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { first } from 'rxjs';
import { User } from '@app/shared/models/user';
import { AppController } from '@app/app.controller';
import { AuthService } from '@app/shared/services/auth-service';
import { matchValidator } from '@app/shared/validators/form-validators';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent extends AppController implements OnInit {
  activeTab: string = 'personal';
  personalForm!: FormGroup;
  passwordForm!: FormGroup;

  personalFormFields = {
    username: { label: 'Username', type: 'text', required: true, minlength: 3 },
    email: { label: 'Email', type: 'email', required: true }
  };

  passwordFormFields = {
    oldPassword: { label: 'Old Password', type: 'password', required: true },
    newPassword: { label: 'New Password', type: 'password', required: true, minlength: 6 },
    confirmNewPassword: { label: 'Confirm New Password', type: 'password', required: true }
  };
  successMessage: string | null = null;
  errorMessage: string | null = null; 
  private successTimeout: any;

  constructor(inject: Injector, authService: AuthService, private fb: FormBuilder, private userService: UserService) {
    super(inject, authService);
  }

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required,  Validators.minLength(6), matchValidator('confirmNewPassword',true)]],
      confirmNewPassword: ['', [Validators.required, matchValidator('newPassword')]],
    });

    this.getItem();
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  getItem() {
    
    this.userService.getUserProfile(this.user.id)
      .pipe(first())
      .subscribe({
        next: data => {
          this.setValueForm(this.user);
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }

  setValueForm(data: any) {    
    this.personalForm.patchValue({
      username: data.name,
      email: data.email,
    });
  }

  updatePersonalData(event:any) {
    if (this.personalForm.invalid) {
      alert('Please fill in the form correctly.');
      return;
    }
  
    const updatedUser: User = {
      id: this.user.id, // Assurez-vous que l'ID de l'utilisateur est inclus
      name: this.personalForm.value.username,
      username: this.personalForm.value.username,
      email: this.personalForm.value.email,
      jwtToken: this.getUser().jwtToken,
    };
    
    this.userService.updateUserProfile(updatedUser).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully.';
        this.errorMessage = null;
        if (this.successTimeout) {
          clearTimeout(this.successTimeout);
        }
        this.successTimeout =  setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.successMessage = null;
        this.errorMessage = error;
      },
      complete: () => {
        console.log('Profile update process complete');
      },
    });
  }

  changePassword(event:any) {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      alert('Please correct the form errors before submitting.');
      return;
    }
  
    const passwordData = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.confirmNewPassword,
    };
  
    this.userService.changePassword(this.user, passwordData).subscribe({
      next: (data) => {
        console.log('change-success');
    
        this.passwordForm.reset();
        this.successMessage = 'Password changed successfully.';
        this.errorMessage = null;
    
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message ?? error.message;
        this.successMessage = null; 
      }
    });
    
    
  }
}

