import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subsidenavbar',
  imports: [CommonModule],
  templateUrl: './subsidenavbar.html',
  styleUrl: './subsidenavbar.scss',
})
export class Subsidenavbar {
  @Input() section = '';

  sectionOptions: { [key: string]: string[] } = {
    dashboard: ['Overview', 'Analytics', 'Reports'],
    settings: ['Profile', 'Preferences', 'Security'],
  };
}
