import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);

  get themeClass(): string {
    return this.router.url === '/' ? 'theme-start' : 'theme-default';
  }

  get themeColor(): string {
    return this.router.url === '/' ? 'white' : 'blue';
  }
}
