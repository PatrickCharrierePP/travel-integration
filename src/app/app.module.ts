import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { ProductComponent } from './product/product.component';
import { WindowRef } from './product/WindowRef';
import { ProductListComponent } from './product-list/product-list.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgCreditCardModule } from 'angular-credit-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: 'home', component: CheckoutComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: '**', component: ProductListComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    NgCreditCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [WindowRef],
  declarations: [
    AppComponent,
    TopBarComponent,
    PlaceholderComponent,
    ProductComponent,
    ProductListComponent,
    CheckoutComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
