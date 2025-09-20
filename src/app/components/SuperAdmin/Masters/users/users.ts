import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService, SectionService } from '../../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  roleId: number = 0;
  showModal = false;
  formData = {
    name: '',
    email: '',
    password: '',
  };
  private sectionService = inject(SectionService);
  section: string | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.sectionService.section$.subscribe((s) => (this.section = s));
    this.roleId = this.authService.getRoleId()!;
  }
  createUser() {
    console.log('Form submitted:', this.formData);
    this.showModal = false;
  }
}
