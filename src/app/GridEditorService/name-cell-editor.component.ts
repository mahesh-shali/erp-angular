import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { EnquiryService } from 'src/app/services/enquiry.service';

@Component({
  selector: 'app-name-cell-editor',
  template: `
    <select
      class="w-full p-1 border rounded"
      (change)="onSelect($event)"
      (blur)="onClose()"
      [value]="value"
      autofocus
      style="width: auto; min-width: 150px; max-width: 400px;"
    >
      <option *ngFor="let item of items" [value]="item.name">
        {{ item.name }}
      </option>
    </select>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class NameCellEditorComponent implements ICellEditorAngularComp {
  private params: any;
  value: string = '';
  items: any[] = [];

  constructor(private enquiryService: EnquiryService) {}

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;

    // Fetch items only when editor is opened
    // this.enquiryService.getItems(params.context.roleId).subscribe((data) => {
    //   this.items = data;
    // });
    this.enquiryService
      .getItems(params.context.roleId)
      .subscribe((response: any) => {
        // Extract only the "name" property
        this.items = response.items.map((item: any) => ({
          name: item.name,
          price: item.price || 0, // optional, if you have price
        }));
      });
  }

  getValue() {
    return this.value;
  }

  onSelect(event: any) {
    event.stopPropagation();
    event.preventDefault();
    const selectedName = event.target.value;
    const selectedItem = this.items.find((i) => i.name === selectedName);
    if (selectedItem) {
      this.value = selectedItem.name;

      // Also update the row's price
      this.params.node.setData({
        ...this.params.node.data,
        name: selectedItem.name,
        price: selectedItem.price,
      });
    }
    this.params.api.stopEditing();
  }

  onClose() {
    this.params.api.stopEditing();
  }

  isPopup?(): boolean {
    return true;
  }

  afterGuiAttached?(): void {
    // optional: focus and adjust width
    const el = this.params.eGridCell.querySelector('select');
    if (el) {
      el.style.width = '250px'; // dynamically set width
    }
  }
}
