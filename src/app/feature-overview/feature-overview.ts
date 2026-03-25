import { Component, input, output, signal } from '@angular/core';
import { FeatureResponse } from '../../../Model/feature-model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-feature-overview',
  imports: [NgOptimizedImage],
  templateUrl: './feature-overview.html',
  styleUrl: './feature-overview.scss',
})
export class FeatureOverview {
  featureList = input<FeatureResponse[]>([]);

  sendOpenDialog = output<{
    mode: 'create' | 'edit' | 'delete';
    type: 'feature';
    feature?: FeatureResponse;
  }>();

  $showAll = signal(false);

  openCreateDialog() {
    this.sendOpenDialog.emit({
      mode: 'create',
      type: 'feature',
    });
  }

  openDeleteDialog(feature: FeatureResponse) {
    this.sendOpenDialog.emit({
      mode: 'delete',
      type: 'feature',
      feature,
    });
  }

  openEditDialog(feature: FeatureResponse) {
    this.sendOpenDialog.emit({
      mode: 'edit',
      type: 'feature',
      feature,
    });
  }
}
