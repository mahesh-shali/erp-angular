import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private closeSubsidenavSource = new Subject<void>();
  closeSubsidenav$ = this.closeSubsidenavSource.asObservable();

  triggerCloseSubsidenav() {
    this.closeSubsidenavSource.next();
  }
}
