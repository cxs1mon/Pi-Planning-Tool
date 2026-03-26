import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { NgClass } from '@angular/common';
import { Navigation } from './navigation/navigation';
import { DataService } from './service/dataService';
import { DialogContainer } from './dialog-container/dialog-container';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private dataService = inject(DataService);
  protected router = inject(Router);
  dialog = inject(MatDialog);

  piName = computed(() => {
    return this.dataService.currentPi()?.name ?? '';
  });

  ngOnInit(): void {
    this.dataService.checkHealth();
  }

  constructor() {
    effect(() => {
      const status = this.dataService.healthStatus();

      if (status === 'down') {
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
      }
    });
  }

  get themeClass(): string {
    return this.router.url === '/' ? 'theme-start' : 'theme-default';
  }

  get themeColor(): string {
    return this.router.url === '/' ? 'white' : 'blue';
  }
}
