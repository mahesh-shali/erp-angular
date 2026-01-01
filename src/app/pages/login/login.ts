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
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
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

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      const roleId = this.auth.getRoleId();
      switch (roleId) {
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
          this.router.navigate(['/']);
      }
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      const dto = { name, email, password };
      this.auth.register(dto).subscribe({
        next: (res) => {
          alert('Registered successfully, please login!');
          this.toggleAuthMode(); // Switch to login view
        },
        error: (err) => {
          console.error('Register failed:', err);
          alert('Registration failed. Try again.');
        },
      });
    } else {
      console.warn('Register form invalid');
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      const dto = { email, password };
      this.auth.login(dto).subscribe({
        next: (response: {
          token: string;
          roleId: number;
          userId: number;
          // organizationId: number;
        }) => {
          // localStorage.setItem('token', response.token);
          // localStorage.setItem('roleId', response.roleId.toString());

          this.auth.setLoginState(
            response.token,
            response.roleId,
            response.userId
            // response.organizationId
          );

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
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          alert('Invalid credentials or server error.');
        },
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
