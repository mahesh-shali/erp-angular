import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})
export class Customer implements OnInit {
  isLoadingCustomer = true;
  roleId: number = 1;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoadingCustomer = false;
    }, 2000);
  }
}
