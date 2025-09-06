import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { enableProdMode } from '@angular/core';
// import { environment } from './environments/environment';
import { environment } from './environments/environment.prod';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
// export { renderApplication } from '@angular/platform-server';
