import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})
export class Customer implements OnInit {
  roleId: number | null = null;
  customers: any[] = [];
  isLoadingCustomer = true;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.roleId = this.authService.getRoleId();

    if (this.roleId) {
      this.customerService.getCustomers(this.roleId).subscribe({
        next: (data) => {
          this.customers = data;
          this.isLoadingCustomer = false;
        },
        error: (err) => {
          console.error('Error fetching customers:', err);
          this.isLoadingCustomer = false;
        },
      });
    }
    setTimeout(() => {
      this.isLoadingCustomer = false;
    }, 2000);
  }
}
