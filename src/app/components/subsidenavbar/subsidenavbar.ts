import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface SubPermission {
  label: string;
  option: string;
  route: string;
  isvisible: boolean;
  icon?: string;
}

@Component({
  selector: 'app-subsidenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './subsidenavbar.html',
  styleUrls: ['./subsidenavbar.scss'],
})
export class Subsidenavbar implements OnInit {
  @Input() section = '';

  sectionOptions: { [key: string]: SubPermission[] } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const cached = localStorage.getItem('subPermissions');
    const timestamp = localStorage.getItem('subPermissions:timestamp');
    const roleId = localStorage.getItem('roleId');

    if (!roleId) {
      console.error('Missing roleId in localStorage');
      return;
    }

    const FIVE_SECONDS = 5 * 1000;
    const now = Date.now();

    if (cached && timestamp && now - parseInt(timestamp) < FIVE_SECONDS) {
      const parsed = JSON.parse(cached);
      this.sectionOptions = this.groupSubPermissions(parsed);
    } else {
      this.http
        .get<any>(`http://localhost:5133/api/auth/permissions/${roleId}`)
        .subscribe({
          next: (data) => {
            const subPermissions = data.subPermissions || [];

            // Store in localStorage
            localStorage.setItem(
              'subPermissions',
              JSON.stringify(subPermissions)
            );
            localStorage.setItem('subPermissions:timestamp', now.toString());

            // Group and assign
            this.sectionOptions = this.groupSubPermissions(subPermissions);
          },
          error: (err) => console.error('Error loading sub-permissions', err),
        });
    }
  }

  get optionsForCurrentSection(): SubPermission[] {
    return this.sectionOptions[this.section] || [];
  }

  private groupSubPermissions(subPermissions: SubPermission[]): {
    [key: string]: SubPermission[];
  } {
    const grouped: { [key: string]: SubPermission[] } = {};
    subPermissions.forEach((perm) => {
      if (perm.isvisible) {
        const key = perm.label?.trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(perm);
      }
    });
    return grouped;
  }
}
