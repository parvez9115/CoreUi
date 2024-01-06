import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet>
      <div id="cover-spin"></div>
    </router-outlet>
    <!-- Display an online/offline status message with a "no connection" icon -->
    <div *ngIf="!isOnline" class="offline-message">
      <img
        src="../../../assets/img/no-connection.png"
        alt="No Connection"
        style="width: 20px; height: 20px; filter: invert(1);margin-bottom:3px;"
      />
      You are currently offline.
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Techno jacks';
  isOnline: boolean;
  lastPage: any;
  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
  ) {
    titleService.setTitle(this.title);
    iconSetService.icons = { ...iconSubset };
  }
  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

}
