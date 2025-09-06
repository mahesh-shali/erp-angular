import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionService } from '../../../services/auth';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

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
export class Item implements OnInit {
  items: Item[] = [];
  private sectionService = inject(SectionService);
  section: string | null = null;
  selectedItem: Item | null = null;
  filteredItems: Item[] = [];
  inputValue = '';
  dropdownVisible = false;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.sectionService.section$.subscribe((s) => (this.section = s));
    this.http.get<Item[]>(`${this.apiUrl}/item/getItems`).subscribe({
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
    setTimeout(() => {
      this.dropdownVisible = false;
    }, 150);
  }

  selectItem(item: Item): void {
    this.selectedItem = item;
  }
}
