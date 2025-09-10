import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionService } from '../../../services/auth';
import { PermissionsService } from '../../../services/permissions.service';
import { SidebarItem } from '../../../constants/constants';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

export interface Item {
  id: number;
  name: string;
}

@Component({
  selector: 'app-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item implements OnInit, OnDestroy {
  items: Item[] = [];
  private sectionService = inject(SectionService);
  private permissionsService = inject(PermissionsService);
  section: string | null = null;
  selectedItem: Item | null = null;
  filteredItems: Item[] = [];
  inputValue = '';
  dropdownVisible = false;
  private apiUrl = environment.apiUrl;
  
  // Permission properties
  canReadItems = false;
  canWriteItems = false;
  canDeleteItems = false;
  canUpdateItems = false;
  
  // Subscriptions
  private permissionsSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({});
    this.sectionService.section$.subscribe((s) => (this.section = s));
    
    // Subscribe to permissions changes
    this.permissionsSubscription = this.permissionsService.subPermissions$.subscribe((permissions) => {
      this.updateItemPermissions(permissions);
    });
    
    // Only fetch items if user has read permission
    if (this.canReadItems) {
      this.fetchItems();
    }
  }
  
  ngOnDestroy(): void {
    this.permissionsSubscription?.unsubscribe();
  }
  
  private updateItemPermissions(permissions: any[]): void {
    // Find item-related permissions
    const itemPermissions = permissions.find(p => 
      p.section === 'item' || 
      p.label?.toLowerCase().includes('item') ||
      p.route?.includes('item')
    );
    
    if (itemPermissions) {
      this.canReadItems = itemPermissions.canread || false;
      this.canWriteItems = itemPermissions.canwrite || false;
      this.canDeleteItems = itemPermissions.candelete || false;
      this.canUpdateItems = itemPermissions.canput || false;
      
      // Fetch items if we now have read permission
      if (this.canReadItems && this.items.length === 0) {
        this.fetchItems();
      }
    }
  }
  
  private fetchItems(): void {
    const headers = new HttpHeaders({});
    this.http.get<Item[]>(`${this.apiUrl}/item/getItems`, {headers, withCredentials: true}).subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
      },
      error: (err) => {
        console.error('Error fetching items', err);
      },
    });
  }

  onInput(): void {
    this.filteredItems = this.items.filter((item) =>
      item.name.toLowerCase().includes(this.inputValue.toLowerCase())
    );
    this.dropdownVisible = true;
  }

  onSelect(item: Item): void {
    this.inputValue = item.name;
    this.selectedItem = item;
    this.dropdownVisible = false;
  }

  onFocus(): void {
    this.filteredItems = this.items;
    this.dropdownVisible = true;
  }

  onBlur(): void {
    // Increased delay for mobile to allow touch interactions
    setTimeout(() => {
      this.dropdownVisible = false;
    }, 200);
  }
  
  // Permission check methods
  canViewItems(): boolean {
    return this.canReadItems;
  }
  
  canAddItems(): boolean {
    return this.canWriteItems;
  }
  
  canEditItems(): boolean {
    return this.canUpdateItems;
  }
  
  canRemoveItems(): boolean {
    return this.canDeleteItems;
  }
  
  // Item management methods (with permission checks)
  addItem(): void {
    if (!this.canAddItems()) {
      console.warn('User does not have permission to add items');
      return;
    }
    // Implementation for adding items
    console.log('Adding new item...');
  }
  
  editItem(item: Item): void {
    if (!this.canEditItems()) {
      console.warn('User does not have permission to edit items');
      return;
    }
    // Implementation for editing items
    console.log('Editing item:', item);
  }
  
  deleteItem(item: Item): void {
    if (!this.canRemoveItems()) {
      console.warn('User does not have permission to delete items');
      return;
    }
    // Implementation for deleting items
    console.log('Deleting item:', item);
  }

}
