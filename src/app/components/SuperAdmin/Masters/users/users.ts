import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SectionService } from '../../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  showModal = false;
  formData = {
    name: '',
    email: '',
    password: '',
  };

  createUser() {
    console.log('Form submitted:', this.formData);
    this.showModal = false;
  }
  private sectionService = inject(SectionService);
  section: string | null = null;

  ngOnInit() {
    this.sectionService.section$.subscribe((s) => (this.section = s));
  }
}
