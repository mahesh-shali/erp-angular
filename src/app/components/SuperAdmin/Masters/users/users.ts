import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService, SectionService } from '../../../../services/auth';
import { FormsModule } from '@angular/forms';
import {
  Organization,
  OrganizationResponse,
  User,
  UserService,
  UsersResponse,
} from 'src/app/services/user.service';
import { response } from 'express';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  roleId: number = 0;
  showModal = false;
  formData: {
    id: number | null;
    name: string;
    email: string;
    password: string;
  } = {
    id: null, // start as null
    name: '',
    email: '',
    password: '',
  };

  userFormData: {
    id: number | null;
    name: string;
    email: string;
    password: string;
  } = {
    id: null,
    name: '',
    email: '',
    password: '',
  };

  orgFormData: {
    id: number | null;
    name: string;
    email: string;
  } = {
    id: null,
    name: '',
    email: '',
  };

  selectedUserId: number | null = null;
  selectedOrgId: number | null = null;
  users: User[] = [];
  count: number = 0;
  userId!: number;
  token!: string;
  searchText: string = '';
  filteredUsers: User[] = [];
  organizations: any[] = [];
  filteredOrgs: any[] = [];
  isLoadingUsers = true;
  isLoadingOrgs = true;
  selectedForm: 'user' | 'organization' = 'user';
  private sectionService = inject(SectionService);
  section: string | null = null;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.sectionService.section$.subscribe((s) => (this.section = s));
    this.roleId = this.authService.getRoleId()!;
    this.loadUsers();
    this.loadOrganizations();
    this.filteredUsers = this.users;
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (response: UsersResponse) => {
        this.users = response.users;
        this.filteredUsers = [...this.users];
        this.count = response.count;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.isLoadingUsers = false;
      },
    });
  }
  // loadOrganizations(): void {
  //   this.isLoadingOrgs = true;
  //   this.userService.getOrganization().subscribe({
  //     next: (response: OrganizationResponse) => {
  //       this.users = response.users;
  //       this.filteredOrgs = [...this.organizations];
  //       this.count = response.count;
  //       this.isLoadingOrgs = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch users', err);
  //       this.isLoadingOrgs = false;
  //     },
  //   });

  //   // this.filteredOrgs = [...this.organizations];
  // }
  loadOrganizations(): void {
    this.isLoadingOrgs = true;
    this.userService.getOrganization().subscribe({
      next: (res: OrganizationResponse) => {
        // Map API response to proper organization objects
        this.organizations = res.users.map((org) => ({
          id: org.userid, // use userid as org id
          name: org.name,
          email: org.email || '', // optional
        }));
        this.filteredOrgs = [...this.organizations];
        this.isLoadingOrgs = false;
      },
      error: (err) => {
        console.error('Failed to fetch organizations', err);
        this.isLoadingOrgs = false;
      },
    });
  }

  onSearchChange() {
    if (this.selectedForm === 'user') {
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredOrgs = this.organizations.filter((organization) =>
        organization.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  selectUser(user: User): void {
    this.userService.getUserById(user.id).subscribe({
      next: (res) => {
        this.selectedUserId = user.id;
        this.selectedOrgId = null;
        this.formData.id = res.id;
        this.formData.name = res.name;
        this.formData.email = res.email;
        this.formData.password = '';
      },
      error: (err) => console.error(err),
    });
  }

  selectOrg(org: any): void {
    this.userService.getOrganizationById(org.id).subscribe({
      next: (orgDetails) => {
        this.selectedOrgId = org.id; // Set selected org
        this.selectedUserId = null; // Clear user selection
        this.orgFormData = {
          // Populate organization form
          id: orgDetails.userid || orgDetails.id, // map id correctly
          name: orgDetails.name,
          email: orgDetails.email || '',
        };
      },
      error: (err) => console.error('Failed to fetch organization', err),
    });
  }

  createOrModifyUser(): void {
    if (this.formData.id) {
      // MODIFY
      console.log('Modify user', this.formData);
      // Call your update API
    } else {
      // CREATE
      console.log('Create user', this.formData);
      // Call your create API
    }
  }
  createOrModifyOrganization(): void {
    if (this.orgFormData.id) {
      // Modify logic
    } else {
      // Create logic
    }
  }

  createUser() {
    console.log('Form submitted:', this.formData);
    this.showModal = false;
  }
  resetUserForm(): void {
    this.formData = { id: null, name: '', email: '', password: '' };
    this.selectedUserId = null;
  }
  resetOrgForm() {
    this.orgFormData = { id: null, name: '', email: '' };
    this.selectedOrgId = null;
  }
}
