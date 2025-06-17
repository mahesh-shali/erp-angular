import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { APP_CONSTANTS, SidebarItem } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidenavbar',
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
    this.http
      .get<SidebarItem[]>('http://localhost:5133/api/sidenavbar/items')
      .subscribe({
        next: (data) => (this.navItems = data),
        error: (err) => console.error('Error loading nav items', err),
      });
  }
  selectSection(section: string) {
    this.selectedSection = section;
    this.sectionSelected.emit(section);
  }
}
