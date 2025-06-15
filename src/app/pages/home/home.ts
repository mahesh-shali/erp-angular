import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { SectionService } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private sectionService = inject(SectionService);
  section: string | null = null;

  ngOnInit() {
    this.sectionService.section$.subscribe((s) => (this.section = s));
  }
}
