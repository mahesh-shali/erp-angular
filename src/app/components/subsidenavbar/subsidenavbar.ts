import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

interface SectionOption {
  label: string;
  path: string;
}

@Component({
  selector: 'app-subsidenavbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './subsidenavbar.html',
  styleUrls: ['./subsidenavbar.scss'], // plural and array
})
export class Subsidenavbar implements OnInit {
  @Input() section = '';

  // Correct the type to reflect new API structure
  sectionOptions: { [key: string]: SectionOption[] } = {};

  constructor(private http: HttpClient) {}

  // Fetch section options from API
  getSectionOptions(): Observable<{ [key: string]: SectionOption[] }> {
    return this.http.get<{ [key: string]: SectionOption[] }>(
      'http://localhost:5133/api/sidenavbar/subNavItems'
    );
  }

  ngOnInit(): void {
    this.getSectionOptions().subscribe((data) => {
      this.sectionOptions = data;
    });
  }

  // Get options for current selected section
  get optionsForCurrentSection(): SectionOption[] {
    return this.sectionOptions[this.section] || [];
  }
}
