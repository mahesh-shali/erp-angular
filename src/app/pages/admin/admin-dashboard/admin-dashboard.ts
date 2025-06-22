import { Component, inject } from '@angular/core';
import { SectionService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private sectionService = inject(SectionService);
  section: string | null = null;

  ngOnInit() {
    this.sectionService.section$.subscribe((s) => (this.section = s));
  }
}
