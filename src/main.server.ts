import 'zone.js/node';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

const bootstrap = (context: BootstrapContext) => 
  bootstrapApplication(AppComponent, appConfig, context);

export default bootstrap;

