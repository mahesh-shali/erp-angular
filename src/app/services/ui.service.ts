import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private closeSubsidenavSource = new Subject<void>();
  closeSubsidenav$ = this.closeSubsidenavSource.asObservable();

  private sidebarOpen = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.sidebarOpen.asObservable();

  private selectedSection = new BehaviorSubject<string | null>(null);
  selectedSection$ = this.selectedSection.asObservable();

  toggleSidebar() {
    this.sidebarOpen.next(!this.sidebarOpen.value);
  }

  openSidebar() {
    if (!this.sidebarOpen.value) {
      this.sidebarOpen.next(true);
    }
  }

  closeSidebar() {
    if (this.sidebarOpen.value) {
      this.sidebarOpen.next(false);
    }
  }

  setSelectedSection(section: string) {
    this.selectedSection.next(section);
  }

  triggerCloseSubsidenav() {
    this.closeSubsidenavSource.next();
  }
}
