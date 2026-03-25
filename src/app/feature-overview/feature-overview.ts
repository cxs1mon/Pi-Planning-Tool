import { Component, output } from '@angular/core';
import { FeatureResponse } from '../../../Model/feature-model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-feature-overview',
  imports: [NgOptimizedImage],
  templateUrl: './feature-overview.html',
  styleUrl: './feature-overview.scss',
})
export class FeatureOverview {
  sendOpenDialog = output<{
    mode: 'create' | 'edit' | 'delete';
    type: 'feature';
    feature?: FeatureResponse;
  }>();

  openCreateDialog() {
    this.sendOpenDialog.emit({
      mode: 'create',
      type: 'feature',
    });
  }
}
