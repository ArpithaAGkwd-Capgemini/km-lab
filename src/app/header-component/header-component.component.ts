import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header-component',
  standalone: false,
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css'
})

export class HeaderComponentComponent {

  activeRoute: string = "";

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url;
      }
    });
  }

  isActive(route: string): boolean {
    if (route === '/upload') {
      return this.activeRoute.startsWith('/upload');
    }
    return this.activeRoute === route;
  }

}

