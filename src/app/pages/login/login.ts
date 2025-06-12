import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const dto = { email, password };
      this.auth.login(dto).subscribe({
        next: (response: { token: string }) => {
          console.log('Login success:', response);
          // e.g., save token and redirect
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']); // adjust path as needed
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
