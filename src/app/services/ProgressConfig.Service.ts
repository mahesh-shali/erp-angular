import { Injectable } from '@angular/core';
import NProgress from 'nprogress';

@Injectable({ providedIn: 'root' })
export class ProgressConfigService {
  start() {
    NProgress.start();
  }

  complete() {
    NProgress.done();
  }

  set(value: number) {
    NProgress.set(value);
  }

  increment() {
    NProgress.inc();
  }
}
