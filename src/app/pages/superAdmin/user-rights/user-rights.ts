import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PermissionGroup {
  title: string;
  color: string;
  permissions: Permission[];
}

interface Permission {
  label: string;
  canread: boolean;
  canwrite: boolean;
  canput: boolean;
  candelete: boolean;
  isvisible: boolean;
  ishidden: boolean;
  isrestricted: boolean;
}

@Component({
  selector: 'app-user-rights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-rights.html',
  styleUrl: './user-rights.scss',
})
export class UserRights implements OnInit {


  

  ngOnInit(): void {
      
  }
  user = {
    id: 106662,
    name: 'test test',
    role: 'Employee',
    template: 'Custom',
  };

  companies = [
    'All',
    '3TimeWinner',
    'Ace It 88',
    'Amazon DE',
    'Angry Bee',
    'Another Test Company',
    'BigCommerce',
    'Canada',
    'Chewy Via DSCO',
  ];
  selectedCompanies: string[] = ['All', 'Ace It 88'];

  // Permission groups
  permissionGroups: PermissionGroup[] = [
    {
      title: 'CATALOG',
      color: 'bg-blue-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: true,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
    {
      title: 'INVENTORY',
      color: 'bg-red-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: false,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
    {
      title: 'INVENTORY',
      color: 'bg-red-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: false,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
    {
      title: 'INVENTORY',
      color: 'bg-red-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: false,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
    {
      title: 'INVENTORY',
      color: 'bg-red-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: false,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
    {
      title: 'INVENTORY',
      color: 'bg-red-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: false,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
    {
      title: 'INVENTORY',
      color: 'bg-red-500',
      permissions: [
        {
          label: 'General Permissions',
          canread: true,
          canwrite: false,
          canput: false,
          candelete: false,
          isvisible: true,
          ishidden: false,
          isrestricted: false,
        },
      ],
    },
  ];
}
