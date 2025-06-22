import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidenavbar } from './components/sidenavbar/sidenavbar';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService, SectionService } from './services/auth';
import { Subsidenavbar } from './components/subsidenavbar/subsidenavbar';
import { Home } from './pages/home/home';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    NgIf,
    RouterOutlet,
    Navbar,
    Sidenavbar,
    CommonModule,
    RouterModule,
    Subsidenavbar,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'client';
  activeSection = '';
  selectedSection: string = '';
  currentSection: string = '';

  constructor(
    public authService: AuthService,
    private sectionService: SectionService,
    private http: HttpClient
  ) {}
  handleSection(section: string) {
    this.activeSection = section;
    this.selectedSection = section;
    this.sectionService.setSection(section);
    this.currentSection = section;
  }
}
