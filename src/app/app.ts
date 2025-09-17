// import { Component } from '@angular/core';
// import { RouterModule, RouterOutlet } from '@angular/router';
// import { Navbar } from './components/navbar/navbar';
// import { Sidenavbar } from './components/sidenavbar/sidenavbar';
// import { CommonModule, NgIf } from '@angular/common';
// import { AuthService, SectionService } from './services/auth';
// import { Subsidenavbar } from './components/subsidenavbar/subsidenavbar';
// import { Home } from './pages/home/home';
// import { MatIconModule } from '@angular/material/icon';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-root',
//   imports: [
//     NgIf,
//     RouterOutlet,
//     Navbar,
//     Sidenavbar,
//     CommonModule,
//     RouterModule,
//     Subsidenavbar,
//     MatIconModule,
//     FormsModule,
//   ],
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
// })
// export class App  {
//   protected title = 'client';
//   activeSection = '';
//   selectedSection: string = '';
//   currentSection: string = '';

//   constructor(
//     public authService: AuthService,
//     private sectionService: SectionService,
//     private http: HttpClient
//   ) {}

//   showSubnav(): boolean {
//     return (
//       this.authService.isLoggedIn() &&
//       !!this.selectedSection &&
//       this.selectedSection.toLowerCase() !== 'dashboard'
//     );
//   }

//   handleSection(section: string) {
//     this.activeSection = section;
//     this.selectedSection = section;
//     this.sectionService.setSection(section);
//     this.currentSection = section;
//   }
// }

import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterModule,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidenavbar } from './components/sidenavbar/sidenavbar';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService, SectionService } from './services/auth';
import { Subsidenavbar } from './components/subsidenavbar/subsidenavbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
export class App implements OnInit {
  protected title = 'client';
  activeSection = '';
  selectedSection: string = '';
  currentSection: string = '';
  private apiUrl = environment.apiUrl;

  constructor(
    public authService: AuthService,
    private sectionService: SectionService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loginUrl = `${this.apiUrl}/auth/login`;
    this.http.get(`${loginUrl}`).subscribe();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        localStorage.setItem('lastRoute', event.urlAfterRedirects);
      });

    if (this.authService.isLoggedIn()) {
      const lastRoute = localStorage.getItem('lastRoute');
      if (lastRoute && lastRoute !== '/login' && lastRoute !== '/register') {
        this.router.navigateByUrl(lastRoute);
      } else {
        this.router.navigate(['/s/dashboard']);
      }
    }
  }

  showSubnav(): boolean {
    return (
      this.authService.isLoggedIn() &&
      !!this.selectedSection &&
      this.selectedSection.toLowerCase() !== 'dashboard'
    );
  }

  handleSection(section: string) {
    this.activeSection = section;
    this.selectedSection = section;
    this.sectionService.setSection(section);
    this.currentSection = section;
  }

  isNotFoundPage(): boolean {
    return this.router.url === '/404';
  }

  isHomePage(): boolean {
    return this.router.url === '/home';
  }
}
