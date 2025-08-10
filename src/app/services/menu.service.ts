// src/app/services/menu.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private selectedSectionSource = new BehaviorSubject<string | null>(null);
  selectedSection$ = this.selectedSectionSource.asObservable();

  setSelectedSection(section: string) {
    this.selectedSectionSource.next(section);
  }
}
