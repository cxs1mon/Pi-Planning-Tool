import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { NgClass } from '@angular/common';
import { Navigation } from './navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected router = inject(Router);

  get themeClass(): string {
    return this.router.url === '/' ? 'theme-start' : 'theme-default';
  }

  get themeColor(): string {
    return this.router.url === '/' ? 'white' : 'blue';
  }
}
