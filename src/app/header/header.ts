import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  themeColor = input('blue');
  piName = input('');
  router = inject(Router);

  navigate(): void {
    this.router.navigate(['/']);
  }
}
