import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarItem } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidenavbar.html',
  styleUrl: './sidenavbar.scss',
})
export class Sidenavbar implements OnInit {
  navItems: SidebarItem[] = [];
  selectedSection: string = '';

  @Output() sectionSelected = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const roleId = localStorage.getItem('roleId');
    if (!roleId) {
      console.error('Missing roleId in localStorage');
      return;
    }

    const cache = localStorage.getItem('mainPermissions');
    const timestamp = localStorage.getItem('mainPermissions:timestamp');
    const FIVE_SECONDS = 5 * 1000;
    const now = Date.now();

    if (cache && timestamp && now - parseInt(timestamp) < FIVE_SECONDS) {
      this.navItems = JSON.parse(cache).filter(
        (item: SidebarItem) => item.isvisible
      );
    } else {
      this.http
        .get<any>(`http://localhost:5133/api/auth/permissions/${roleId}`)
        .subscribe({
          next: (data) => {
            const mainPermissions = data.mainPermissions || [];

            // Cache main permissions with timestamp
            localStorage.setItem(
              'mainPermissions',
              JSON.stringify(mainPermissions)
            );
            localStorage.setItem('mainPermissions:timestamp', now.toString());

            this.navItems = mainPermissions.filter(
              (item: SidebarItem) => item.isvisible
            );
          },
          error: (err) => console.error('Error loading nav items', err),
        });
    }
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.sectionSelected.emit(section);
  }
}
