import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  form: FormGroup;
  credit_card = {
    name: 'John SMITH',
    number: '5555 **** **** 5678',
    expiry: '02/27',
    cvv: '555',
  };

  constructor(builder: FormBuilder) {
    this.form = builder.group({
      name: 'John SMITH',
      number: '1234 **** **** 5678',
      expiry: '02/27',
      cvv: '555',
    });
  }
}
