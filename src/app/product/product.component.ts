import { Component, Input } from '@angular/core';

import { WindowRef } from './WindowRef';
import { Product } from '../products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  @Input() product!: Product;

  constructor(private winRef: WindowRef) {
    // getting the native window obj
    console.log('Native window obj', winRef.nativeWindow);
  }
  ngAfterContentInit() {
    console.log('', this.winRef.nativeWindow.PlanPaySDK);
    this.winRef.nativeWindow.PlanPaySDK.pricePreview.refresh({
      targetElement: '.search-results',
    });
  }
}
