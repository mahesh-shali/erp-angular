import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})
export class Customer implements OnInit {
  roleId: number = 1;
  isLoading = true;
  searchText = '';
  selectedUserId: number | null = null;

  userFormData: any = {
    name: '',
    organization: '',
    roleId: '',
    email: '',
    password: '',
  };

  staticOrgs = ['Google', 'Microsoft', 'Amazon', 'Tesla'];
  staticRoles = [
    { id: 1, name: 'Super Admin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Manager' },
    { id: 4, name: 'User' },
  ];
  staticUsers = [
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'Manager' },
    { id: 3, name: 'Charlie', role: 'User' },
  ];
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  resetUserForm() {
    this.userFormData = {
      name: '',
      organization: '',
      roleId: '',
      email: '',
      password: '',
    };
    this.selectedUserId = null;
  }
}
