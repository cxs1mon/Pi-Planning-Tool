import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation implements OnInit {
  private route = inject(ActivatedRoute);
  public piId: number | null = null;

  ngOnInit(): void {
    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    currentRoute.paramMap.subscribe((pm) => {
      const rawId = pm.get('id');

      if (rawId === null) {
        this.piId = null;
        return;
      }

      this.piId = Number(rawId);
    });
  }
}
