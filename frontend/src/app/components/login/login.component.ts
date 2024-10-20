import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(-100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit{
  formGroup!: FormGroup;
  formFields = {
    email: { label: 'Email', type: 'email', required: true },
    password: { label: 'Password', type: 'password', required: true, minlength:6 },
  };
  error: any = { bool: false, message: '' };
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }
  onSubmit(formData: any) {
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value).subscribe({
        next: (data) => {
          console.log('data-success',data);
          console.log(this.returnUrl);
          
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error: any) => {
          console.log(error);

          this.error = {
            bool: true,
            message: error.error?.message ?? error.message,
          };
        },
      });
    }
  }
}
