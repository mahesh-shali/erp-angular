import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService, SectionService } from '../../../../services/auth';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  roles: any[] = [];
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
    organizationid: number | null;
    roleId: number | null;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalcode: number | null;
    country: string;
  } = {
    id: null,
    name: '',
    email: '',
    password: '',
    organizationid: null,
    roleId: 0,
    phone: '',
    street: '',
    city: '',
    state: '',
    postalcode: null,
    country: '',
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
  editingPassword = false;
  selectedForm: 'user' | 'organization' = 'user';
  private sectionService = inject(SectionService);
  section: string | null = null;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.sectionService.section$.subscribe((s) => (this.section = s));
    this.roleId = this.authService.getRoleId()!;
    this.loadUsers();
    this.loadOrganizations();
    this.loadRoles();
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
          id: org.userid ?? org.userid, // use userid as org id
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

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data: any) => {
        this.roles = data.roles;
      },
      error: (err) => {
        console.error('Error loading roles', err);
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
        this.userFormData = {
          id: res.id,
          name: res.name,
          email: res.email,
          password: '', // clear password for security
          roleId: res.roleId, // populate if available
          organizationid: res.organizationid || null, // populate if available
          phone: res.phone,
          street: res.street,
          city: res.city,
          state: res.state,
          postalcode: res.postalcode,
          country: res.country,
        };
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
    const payload = {
      ...this.userFormData,
      id: this.userFormData.id ?? undefined,
      organizationid: this.userFormData.organizationid ?? undefined, // send selected org id
      roleId: this.userFormData.roleId!,
    };

    if (payload.id) {
      // MODIFY
      this.userService.saveUser(payload).subscribe({
        next: () => {
          this.toastr.success('User updated successfully!', 'Success');
          this.resetUserForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update user.', 'Error');
        },
      });
    } else {
      // CREATE
      this.userService.saveUser(payload).subscribe({
        next: (res: any) => {
          if (res === 'User already exists.') {
            this.snackBar.open('User already exists.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          } else {
            this.snackBar.open('User created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.resetUserForm();
            this.loadUsers();
          }
        },
        error: (err) => {
          console.error(err);
          const msg = err?.error?.message || 'Something went wrong';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
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
    this.userFormData = {
      id: null,
      name: '',
      email: '',
      password: '',
      organizationid: null,
      roleId: null,
      phone: '',
      street: '',
      city: '',
      state: '',
      postalcode: null,
      country: '',
    };
    this.selectedUserId = null;
  }

  resetOrgForm() {
    this.orgFormData = { id: null, name: '', email: '' };
    this.selectedOrgId = null;
  }

  allowNumbersOnly(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
}
