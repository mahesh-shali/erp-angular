// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { ICellEditorAngularComp } from 'ag-grid-angular';
// import { EnquiryService } from 'src/app/services/enquiry.service';

// @Component({
//   selector: 'app-name-cell-editor',
//   template: `
//     <select
//       class="w-full p-1 border rounded"
//       (change)="onSelect($event)"
//       (blur)="onClose()"
//       [value]="value"
//       autofocus
//       style="width: auto; min-width: 150px; max-width: 400px;"
//     >
//       <option *ngFor="let item of items" [value]="item.name">
//         {{ item.name }}
//       </option>
//     </select>
//   `,
//   standalone: true,
//   imports: [CommonModule],
// })
// export class NameCellEditorComponent implements ICellEditorAngularComp {
//   private params: any;
//   value: string = '';
//   items: any[] = [];

//   constructor(private enquiryService: EnquiryService) {}

//   agInit(params: any): void {
//     this.params = params;
//     this.value = params.value;

//     // Fetch items only when editor is opened
//     // this.enquiryService.getItems(params.context.roleId).subscribe((data) => {
//     //   this.items = data;
//     // });
//     this.enquiryService
//       .getItems(params.context.roleId)
//       .subscribe((response: any) => {
//         // Extract only the "name" property
//         this.items = response.items.map((item: any) => ({
//           name: item.name,
//           price: item.price || 0, // optional, if you have price
//         }));
//       });
//   }

//   getValue() {
//     return this.value;
//   }

//   onSelect(event: any) {
//     event.stopPropagation();
//     event.preventDefault();
//     const selectedName = event.target.value;
//     const selectedItem = this.items.find((i) => i.name === selectedName);
//     if (selectedItem) {
//       this.value = selectedItem.name;

//       // Also update the row's price
//       this.params.node.setData({
//         ...this.params.node.data,
//         name: selectedItem.name,
//         price: selectedItem.price,
//       });
//     }
//     this.params.api.stopEditing();
//   }

//   onClose() {
//     this.params.api.stopEditing();
//   }

//   isPopup?(): boolean {
//     return true;
//   }

//   afterGuiAttached?(): void {
//     // optional: focus and adjust width
//     const el = this.params.eGridCell.querySelector('select');
//     if (el) {
//       el.style.width = '250px'; // dynamically set width
//     }
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-name-cell-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <select
        class="w-full p-1 border rounded"
        (change)="onSelect($event)"
        (blur)="onClose()"
        [value]="value"
        [disabled]="loading"
        autofocus
        style="min-width: 150px; max-width: 400px;"
      >
        <option *ngIf="loading" disabled>Loading...</option>
        <option value="" disabled selected>Select item</option>
        <option *ngFor="let item of items" [value]="item.name">
          {{ item.name }}
        </option>
      </select>

      <!-- Inline spinner -->
      <div
        *ngIf="loading"
        class="absolute top-1/2 right-2 transform -translate-y-1/2"
      >
        <span class="loader border-t-transparent border-blue-500"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .loader {
        border: 2px solid #ccc;
        border-top-color: transparent;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class NameCellEditorComponent
  implements ICellEditorAngularComp, OnDestroy
{
  private params: any;
  value: string = '';
  items: any[] = [];
  loading = false;
  private subscription?: Subscription;

  constructor(private enquiryService: EnquiryService) {}

  agInit(params: any): void {
    this.params = params;
    this.value = params.value || '';
    this.loadItems(params.context.roleId);
  }

  /** Fetch items when dropdown opens */
  private loadItems(roleId: number | string) {
    const id = typeof roleId === 'string' ? Number(roleId) : roleId;
    if (id === null || id === undefined || Number.isNaN(Number(id))) {
      console.warn('Invalid roleId provided to loadItems:', roleId);
      this.loading = false;
      return;
    }

    this.loading = true;
    this.subscription = this.enquiryService.getItems(Number(id)).subscribe({
      next: (response: any) => {
        this.items = (response?.items || []).map((item: any) => ({
          name: item.name,
          price: item.price || 0,
        }));
        this.loading = false;

        setTimeout(
          () => this.params.api.refreshCells({ rowNodes: [this.params.node] }),
          0
        );
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.loading = false;
      },
    });
  }

  getValue() {
    return this.value;
  }

  onSelect(event: any) {
    const selectedName = event.target.value;
    const selectedItem = this.items.find((i) => i.name === selectedName);
    if (selectedItem) {
      this.value = selectedItem.name;

      // Update the current row data
      // this.params.node.setData({
      //   ...this.params.node.data,
      //   name: selectedItem.name,
      //   price: selectedItem.price,
      // });
      this.params.node.setDataValue('name', selectedItem.name);
      this.params.node.setDataValue('price', selectedItem.price);
    }
    this.params.api.stopEditing();
  }

  onClose() {
    this.params.api.stopEditing();
  }

  isPopup(): boolean {
    return true;
  }

  afterGuiAttached(): void {
    // Optional: Adjust dropdown width dynamically
    const el = this.params.eGridCell.querySelector('select');
    if (el) {
      el.style.width = '250px';
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
