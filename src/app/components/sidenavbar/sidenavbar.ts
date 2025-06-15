import { Component, EventEmitter, Output } from '@angular/core';
import { APP_CONSTANTS, SidebarItem } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenavbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenavbar.html',
  styleUrl: './sidenavbar.scss',
})
export class Sidenavbar {
  navItems: SidebarItem[] = APP_CONSTANTS.NAV_ITEMS;

  @Output() sectionSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.navItems = APP_CONSTANTS.NAV_ITEMS;
  }
  selectSection(section: string) {
    this.sectionSelected.emit(section);
  }
}
