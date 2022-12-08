import { Component, Input } from '@angular/core';

//import * as PlanPaySDK from '../../dist/packages/sdk-app/planpay-sdk.js';
import { Product } from '../products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  @Input() product!: Product;

  ngAfterContentInit() {
    this.PlanPaySDK.then((value) => {
      console.log('=========', value);
    });

    /*PlanPaySDK.pricePreview.refresh({
      targetElement: '.search-results',
    });*/
  }

  PlanPaySDK: Promise<any>;

  constructor() {
    this.PlanPaySDK = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });
  }

  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; ++i) {
      if (
        scripts[i].getAttribute('src') != null &&
        scripts[i].getAttribute('src')?.includes('loader')
      ) {
        isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = ['../../dist/packages/sdk-app/planpay-sdk.js'];

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }
}
