import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { ItemService } from 'src/app/services/item.service';
import { Subscription } from 'rxjs';

export interface Item {
  id: number;
  uuid: string;
  name: string;
}

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item implements OnInit, OnDestroy {
  roleId: number | null = null;
  items: Item[] = [];
  itemForm!: FormGroup;
  isLoadingItem = true;
  selectedItem: any = null;
  private sub?: Subscription;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: [''],
    });

    this.loadItems();
  }

  loadItems(): void {
    this.roleId = this.authService.getRoleId();

    if (!this.roleId) {
      console.error('Role ID not found.');
      this.isLoadingItem = false;
      return;
    }
    this.isLoadingItem = true;
    this.itemService.getItems(this.roleId).subscribe({
      next: (data: any) => {
        this.items = data.items || [];
        this.isLoadingItem = false;
      },
      error: (err) => {
        console.error('Error fetching items:', err);
        this.isLoadingItem = false;
      },
    });
  }

  onItemClick(item: Item): void {
    this.selectedItem = item;
    this.itemForm.patchValue({
      name: item.name,
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
