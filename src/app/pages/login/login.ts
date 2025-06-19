import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const dto = { email, password };
      this.auth.login(dto).subscribe({
        next: (response: { token: string; roleId: number }) => {
          console.log('Login success:', response);

          localStorage.setItem('token', response.token);
          localStorage.setItem('roleId', response.roleId.toString());

          // Route based on role
          switch (response.roleId) {
            case 1:
              this.router.navigate(['/s/dashboard']);
              break;
            case 2:
              this.router.navigate(['/a/dashboard']);
              break;
            case 3:
              this.router.navigate(['/m/dashboard']);
              break;
            case 4:
              this.router.navigate(['/u/dashboard']);
              break;
            default:
              alert('Unknown role!');
          }
        },
        error: (error: any) => {
          console.error('Login failed:', error);
          alert('Invalid credentials or server error.');
        },
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
