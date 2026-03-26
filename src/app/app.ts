import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { NgClass } from '@angular/common';
import { Navigation } from './navigation/navigation';
import { DataService } from './service/dataService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private dataService = inject(DataService);
  protected router = inject(Router);

  piName = computed(() => {
    return this.dataService.currentPi()?.name ?? '';
  });

  get themeClass(): string {
    return this.router.url === '/' ? 'theme-start' : 'theme-default';
  }

  get themeColor(): string {
    return this.router.url === '/' ? 'white' : 'blue';
  }
}
