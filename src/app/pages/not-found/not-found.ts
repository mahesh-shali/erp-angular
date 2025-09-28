import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
})
export class NotFound implements OnInit {
  lastLocation: string = '';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
  ngOnInit() {}
}
