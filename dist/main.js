"use strict";
(self["webpackChunkangular_io_example"] = self["webpackChunkangular_io_example"] || []).push([["main"],{

/***/ 5041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 4565);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8298);
/* harmony import */ var _top_bar_top_bar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./top-bar/top-bar.component */ 4097);



class AppComponent {}
AppComponent.ɵfac = function AppComponent_Factory(t) {
  return new (t || AppComponent)();
};
AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: AppComponent,
  selectors: [["app-root"]],
  decls: 3,
  vars: 0,
  consts: [[1, "container"]],
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "app-top-bar");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "router-outlet");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterOutlet, _top_bar_top_bar_component__WEBPACK_IMPORTED_MODULE_0__.TopBarComponent],
  styles: [".container[_ngcontent-%COMP%] {\r\n  background-color: #f7f7fa;\r\n  height: calc(100% - 68px);\r\n  width: 100vw;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\n/*# sourceURL=webpack://./src/app/app.component.css */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5QkFBeUI7RUFDekIseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWixhQUFhO0VBQ2Isc0JBQXNCO0FBQ3hCIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmYTtcclxuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDY4cHgpO1xyXG4gIHdpZHRoOiAxMDB2dztcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 6747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ 287);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 8298);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 8665);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 5041);
/* harmony import */ var _top_bar_top_bar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./top-bar/top-bar.component */ 4097);
/* harmony import */ var _placeholder_placeholder_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeholder/placeholder.component */ 680);
/* harmony import */ var _product_product_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./product/product.component */ 7695);
/* harmony import */ var _product_list_product_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./product-list/product-list.component */ 8415);
/* harmony import */ var _checkout_checkout_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./checkout/checkout.component */ 1594);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/platform-browser/animations */ 6293);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 1027);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 7681);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/expansion */ 6775);
/* harmony import */ var angular_credit_card__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! angular-credit-card */ 1946);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/form-field */ 3428);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/input */ 7442);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 4565);


















const routes = [{
  path: 'home',
  component: _checkout_checkout_component__WEBPACK_IMPORTED_MODULE_5__.CheckoutComponent
}, {
  path: 'checkout',
  component: _checkout_checkout_component__WEBPACK_IMPORTED_MODULE_5__.CheckoutComponent
}, {
  path: 'product-list',
  component: _product_list_product_list_component__WEBPACK_IMPORTED_MODULE_4__.ProductListComponent
}, {
  path: '**',
  component: _product_list_product_list_component__WEBPACK_IMPORTED_MODULE_4__.ProductListComponent
}];
class AppModule {}
AppModule.ɵfac = function AppModule_Factory(t) {
  return new (t || AppModule)();
};
AppModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
  type: AppModule,
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent]
});
AppModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
  imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forRoot(routes), _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__.BrowserAnimationsModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_13__.MatExpansionModule, angular_credit_card__WEBPACK_IMPORTED_MODULE_14__.NgCreditCardModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormFieldModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_16__.MatInputModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent, _top_bar_top_bar_component__WEBPACK_IMPORTED_MODULE_1__.TopBarComponent, _placeholder_placeholder_component__WEBPACK_IMPORTED_MODULE_2__.PlaceholderComponent, _product_product_component__WEBPACK_IMPORTED_MODULE_3__.ProductComponent, _product_list_product_list_component__WEBPACK_IMPORTED_MODULE_4__.ProductListComponent, _checkout_checkout_component__WEBPACK_IMPORTED_MODULE_5__.CheckoutComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__.BrowserAnimationsModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_13__.MatExpansionModule, angular_credit_card__WEBPACK_IMPORTED_MODULE_14__.NgCreditCardModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormFieldModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_16__.MatInputModule]
  });
})();

/***/ }),

/***/ 1594:
/*!************************************************!*\
  !*** ./src/app/checkout/checkout.component.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckoutComponent": () => (/* binding */ CheckoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4565);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 8665);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/expansion */ 6775);
/* harmony import */ var angular_credit_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular-credit-card */ 1946);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/form-field */ 3428);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/input */ 7442);






class CheckoutComponent {
  constructor(builder) {
    this.credit_card = {
      name: 'John SMITH',
      number: '5555 **** **** 5678',
      expiry: '02/27',
      cvv: '555'
    };
    this.form = builder.group({
      name: 'John SMITH',
      number: '1234 **** **** 5678',
      expiry: '02/27',
      cvv: '555'
    });
  }
}
CheckoutComponent.ɵfac = function CheckoutComponent_Factory(t) {
  return new (t || CheckoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder));
};
CheckoutComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: CheckoutComponent,
  selectors: [["app-checkout"]],
  decls: 38,
  vars: 9,
  consts: [["hideToggle", ""], [1, "credit-card"], [1, "credit-card-form", 3, "formGroup"], [1, "example-full-width"], ["matInput", "", "name", "name", "formControlName", "name", 3, "ngModel", "ngModelChange"], ["matInput", "", "number", "number", "formControlName", "number", 3, "ngModel", "ngModelChange"], ["matInput", "", "expiry", "expiry", "formControlName", "expiry", 3, "ngModel", "ngModelChange"], [1, "example-full-width", 2, "margin-bottom", "-1.25em"], ["matInput", "", "cvv", "cvv", "formControlName", "cvv", 3, "ngModel", "ngModelChange"], [3, "name", "number", "cvc", "expiry"], ["id", "wrapper"], [1, "aligner"], ["data-planpay-checkout-id", "6e647a93-8b49-46b0-b1bc-2c4759a8a97d", 1, "aligner-item", "planpay-checkout-widget"]],
  template: function CheckoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Checkout");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-accordion")(3, "mat-expansion-panel", 0)(4, "mat-expansion-panel-header")(5, "mat-panel-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Pay in full");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "mat-panel-description");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Credit card options ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 1)(10, "form", 2)(11, "mat-form-field", 3)(12, "mat-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Cardholder");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "input", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CheckoutComponent_Template_input_ngModelChange_14_listener($event) {
        return ctx.credit_card.name = $event;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "mat-form-field", 3)(16, "mat-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Card number");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CheckoutComponent_Template_input_ngModelChange_18_listener($event) {
        return ctx.credit_card.number = $event;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "mat-form-field", 3)(20, "mat-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Expiry");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "input", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CheckoutComponent_Template_input_ngModelChange_22_listener($event) {
        return ctx.credit_card.expiry = $event;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "mat-form-field", 7)(24, "mat-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "CVV");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "input", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CheckoutComponent_Template_input_ngModelChange_26_listener($event) {
        return ctx.credit_card.cvv = $event;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "ng-credit-card", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "mat-expansion-panel", 0)(29, "mat-expansion-panel-header")(30, "mat-panel-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, " Pay in instalments");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "mat-panel-description");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, " Planpay ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 10)(35, "div", 11)(36, "div", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Loading planpay\u2026 ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credit_card.name);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credit_card.number);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credit_card.expiry);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credit_card.cvv);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("name", ctx.credit_card.name)("number", ctx.credit_card.number)("cvc", ctx.credit_card.cvv)("expiry", ctx.credit_card.expiry);
    }
  },
  dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_2__.MatAccordion, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_2__.MatExpansionPanel, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_2__.MatExpansionPanelHeader, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_2__.MatExpansionPanelTitle, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_2__.MatExpansionPanelDescription, angular_credit_card__WEBPACK_IMPORTED_MODULE_3__.NgCreditCardComponent, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatLabel, _angular_material_input__WEBPACK_IMPORTED_MODULE_5__.MatInput],
  styles: [".credit-card[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-evenly;\n  align-items: center;\n}\n\n.credit-card[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  width: 300px;\n}\n\n.credit-card-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n\n.aligner[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n}\n\n.aligner-item[_ngcontent-%COMP%] {\n max-width: 50%;\n}\n\n.planpay-checkout-widget[_ngcontent-%COMP%] {\n  max-width: 600px;\n  min-width: 300px;\n  padding: 20px;\n  border: 1px solid #ccc;\n  border-radius: 5px;\n}\n/*# sourceURL=webpack://./src/app/checkout/checkout.component.css */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY2hlY2tvdXQvY2hlY2tvdXQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7RUFDN0IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsdUJBQXVCO0VBQ3ZCLGFBQWE7QUFDZjs7QUFFQTtDQUNDLGNBQWM7QUFDZjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixrQkFBa0I7QUFDcEIiLCJzb3VyY2VzQ29udGVudCI6WyIuY3JlZGl0LWNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmNyZWRpdC1jYXJkID4gKiB7XG4gIHdpZHRoOiAzMDBweDtcbn1cblxuLmNyZWRpdC1jYXJkLWZvcm0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuXG4uYWxpZ25lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBoZWlnaHQ6IDEwMHZoO1xufVxuXG4uYWxpZ25lci1pdGVtIHtcbiBtYXgtd2lkdGg6IDUwJTtcbn1cblxuLnBsYW5wYXktY2hlY2tvdXQtd2lkZ2V0IHtcbiAgbWF4LXdpZHRoOiA2MDBweDtcbiAgbWluLXdpZHRoOiAzMDBweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 680:
/*!******************************************************!*\
  !*** ./src/app/placeholder/placeholder.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlaceholderComponent": () => (/* binding */ PlaceholderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4565);

class PlaceholderComponent {}
PlaceholderComponent.ɵfac = function PlaceholderComponent_Factory(t) {
  return new (t || PlaceholderComponent)();
};
PlaceholderComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: PlaceholderComponent,
  selectors: [["app-placeholder"]],
  decls: 6,
  vars: 0,
  consts: [[1, "placeholder", "w-full", "flex", "items-center", "flex-col"], [1, "flex", "bg-white", "shadow-md", "p-4", "rounded-md"], ["data-placeholder", "", 1, "mr-2", "h-20", "w-20", "rounded-full", "overflow-hidden", "relative", "bg-gray-200"], [1, "flex", "flex-col", "justify-between"], ["data-placeholder", "", 1, "mb-2", "h-5", "w-40", "overflow-hidden", "relative", "bg-gray-200"], ["data-placeholder", "", 1, "h-10", "w-40", "overflow-hidden", "relative", "bg-gray-200"]],
  template: function PlaceholderComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 4)(5, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    }
  },
  styles: [".placeholder[_ngcontent-%COMP%] {\n  display: inline-block;\n  height: 20px;\n  width: 100%;\n  min-width: 50px;\n  background-color: rgb(226, 226, 226);\n  border-radius: 3px;\n  overflow: hidden;\n}\n\n[data-placeholder][_ngcontent-%COMP%]::after {\n  content: ' ';\n  box-shadow: 0 0 50px 9px rgba(254, 254, 254);\n  position: relative;\n  top: 0;\n  left: -100%;\n  height: 100%;\n  animation: _ngcontent-%COMP%_load 1s infinite;\n}\n\n@keyframes _ngcontent-%COMP%_load {\n  0% {\n    left: -100%;\n  }\n  100% {\n    left: 150%;\n  }\n}\n/*# sourceURL=webpack://./src/app/placeholder/placeholder.component.css */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGxhY2Vob2xkZXIvcGxhY2Vob2xkZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFxQjtFQUNyQixZQUFZO0VBQ1osV0FBVztFQUNYLGVBQWU7RUFDZixvQ0FBb0M7RUFDcEMsa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLFlBQVk7RUFDWiw0Q0FBNEM7RUFDNUMsa0JBQWtCO0VBQ2xCLE1BQU07RUFDTixXQUFXO0VBQ1gsWUFBWTtFQUNaLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFO0lBQ0UsV0FBVztFQUNiO0VBQ0E7SUFDRSxVQUFVO0VBQ1o7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi5wbGFjZWhvbGRlciB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgaGVpZ2h0OiAyMHB4O1xuICB3aWR0aDogMTAwJTtcbiAgbWluLXdpZHRoOiA1MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI2LCAyMjYsIDIyNik7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuW2RhdGEtcGxhY2Vob2xkZXJdOjphZnRlciB7XG4gIGNvbnRlbnQ6ICcgJztcbiAgYm94LXNoYWRvdzogMCAwIDUwcHggOXB4IHJnYmEoMjU0LCAyNTQsIDI1NCk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAtMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBhbmltYXRpb246IGxvYWQgMXMgaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgbG9hZCB7XG4gIDAlIHtcbiAgICBsZWZ0OiAtMTAwJTtcbiAgfVxuICAxMDAlIHtcbiAgICBsZWZ0OiAxNTAlO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 8415:
/*!********************************************************!*\
  !*** ./src/app/product-list/product-list.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProductListComponent": () => (/* binding */ ProductListComponent)
/* harmony export */ });
/* harmony import */ var _products__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../products */ 3351);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4565);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 7073);
/* harmony import */ var _product_product_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../product/product.component */ 7695);




function ProductListComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "app-product", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("product", product_r1);
  }
}
class ProductListComponent {
  constructor() {
    this.products = _products__WEBPACK_IMPORTED_MODULE_0__.products;
  }
  share() {
    window.alert('The product has been shared!');
  }
}
ProductListComponent.ɵfac = function ProductListComponent_Factory(t) {
  return new (t || ProductListComponent)();
};
ProductListComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: ProductListComponent,
  selectors: [["app-product-list"]],
  decls: 2,
  vars: 1,
  consts: [[1, "product-list-container"], [4, "ngFor", "ngForOf"], [3, "product"]],
  template: function ProductListComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, ProductListComponent_div_1_Template, 2, 1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.products);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _product_product_component__WEBPACK_IMPORTED_MODULE_1__.ProductComponent],
  styles: [".product-list-container[_ngcontent-%COMP%] {\r\n  max-width: 900px;\r\n}\n/*# sourceURL=webpack://./src/app/product-list/product-list.component.css */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZHVjdC1saXN0L3Byb2R1Y3QtbGlzdC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZ0JBQWdCO0FBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiLnByb2R1Y3QtbGlzdC1jb250YWluZXIge1xyXG4gIG1heC13aWR0aDogOTAwcHg7XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 7695:
/*!**********************************************!*\
  !*** ./src/app/product/product.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProductComponent": () => (/* binding */ ProductComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 4565);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 7073);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 7681);
/* harmony import */ var _placeholder_placeholder_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../placeholder/placeholder.component */ 680);




function ProductComponent_p_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.product.description);
  }
}
class ProductComponent {
  constructor() {
    this.PlanPaySDK = new Promise(resolve => {
      this.loadScript();
      resolve(true);
    });
  }
  ngAfterContentInit() {
    this.PlanPaySDK.then(value => {
      console.log('=========', value);
    });
    /*PlanPaySDK.pricePreview.refresh({
      targetElement: '.search-results',
    });*/
  }

  loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src')?.includes('loader')) {
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
ProductComponent.ɵfac = function ProductComponent_Factory(t) {
  return new (t || ProductComponent)();
};
ProductComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: ProductComponent,
  selectors: [["app-product"]],
  inputs: {
    product: "product"
  },
  decls: 33,
  vars: 5,
  consts: [[1, "product-container"], [1, "product-img-container"], [1, "product-img"], [1, "product-description-container"], [1, "product-title"], [1, "product-features"], [1, "product-description"], [4, "ngIf"], [1, "product-informations"], [1, "product-extras"], [1, "product-actions", "search-results"], [1, "product-price"], [1, "currency-tag"], [1, "price-tag"], [1, "per-night"], ["data-planpay-data-type", "price-preview", "data-planpay-total-cost", "200.00", "data-planpay-currency-code", "AUD", "data-planpay-redemption-date", "2023-03-30", "data-planpay-payment-deadline", "60", "data-planpay-total-minimum-deposit", "20.00", "data-planpay-merchant-id", "dhj987l", 1, "placeholder"], ["mat-raised-button", "", "color", "primary", 1, "book-button"]],
  template: function ProductComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 3)(4, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "app-placeholder")(8, "app-placeholder")(9, "app-placeholder")(10, "app-placeholder");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, ProductComponent_p_12_Template, 2, 1, "p", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 8)(14, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "app-placeholder")(16, "app-placeholder")(17, "app-placeholder")(18, "app-placeholder")(19, "app-placeholder")(20, "app-placeholder");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 10)(22, "div", 11)(23, "span", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "A$");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "span", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "span", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "/NIGHT");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 15);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Loading... ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "button", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, " BOOK NOW ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵstyleProp"]("background-image", "url(" + ctx.product.img.src + ")");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.product.name, " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.product.description);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.product.price);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _placeholder_placeholder_component__WEBPACK_IMPORTED_MODULE_0__.PlaceholderComponent],
  styles: [".product-container[_ngcontent-%COMP%] {\n  display: flex;\n  border: 1px solid #dfe1e5;\n  border-radius: 15px;\n  margin: 30px;\n  overflow: hidden;\n  background-color: white;\n}\n\n.product-img-container[_ngcontent-%COMP%] {\n  overflow: hidden;\n  position: relative;\n  width: 50%;\n}\n\n.product-img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n\n  height: 100%;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.product-description-container[_ngcontent-%COMP%] {\n  width: 75%;\n  padding: 30px;\n  display: flex;\n  flex-direction: column;\n}\n\n.product-title[_ngcontent-%COMP%] {\n  font-size: x-large;\n  font-weight: 800;\n}\n\n.product-features[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.product-features[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  width: 60px;\n  margin: 5px 10px 0 0;\n  overflow: hidden;\n}\n\n.product-extras[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  display: block;\n  margin: 8px 0 0 0;\n  width: 170px;\n}\n\n.product-informations[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n\n.product-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: flex-end;\n}\n\n.currency-tag[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n\n.price-tag[_ngcontent-%COMP%] {\n  font-size: xx-large;\n  font-weight: 900;\n}\n\n.per-night[_ngcontent-%COMP%] {\n  font-size: small;\n}\n/*# sourceURL=webpack://./src/app/product/product.component.css */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZHVjdC9wcm9kdWN0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFhO0VBQ2IseUJBQXlCO0VBQ3pCLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osZ0JBQWdCO0VBQ2hCLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsVUFBVTtBQUNaOztBQUVBO0VBQ0UsY0FBYztFQUNkLFdBQVc7RUFDWCwyQkFBMkI7RUFDM0IsNEJBQTRCO0VBQzVCLHNCQUFzQjs7RUFFdEIsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsTUFBTTtBQUNSOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGFBQWE7RUFDYixhQUFhO0VBQ2Isc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGFBQWE7RUFDYiwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsb0JBQW9CO0VBQ3BCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxpQkFBaUI7RUFDakIsWUFBWTtBQUNkOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIseUJBQXlCO0VBQ3pCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLG1CQUFtQjtFQUNuQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyIucHJvZHVjdC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGZlMWU1O1xuICBib3JkZXItcmFkaXVzOiAxNXB4O1xuICBtYXJnaW46IDMwcHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xufVxuXG4ucHJvZHVjdC1pbWctY29udGFpbmVyIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogNTAlO1xufVxuXG4ucHJvZHVjdC1pbWcge1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcblxuICBoZWlnaHQ6IDEwMCU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDA7XG4gIHRvcDogMDtcbn1cblxuLnByb2R1Y3QtZGVzY3JpcHRpb24tY29udGFpbmVyIHtcbiAgd2lkdGg6IDc1JTtcbiAgcGFkZGluZzogMzBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLnByb2R1Y3QtdGl0bGUge1xuICBmb250LXNpemU6IHgtbGFyZ2U7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbi5wcm9kdWN0LWZlYXR1cmVzIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xufVxuXG4ucHJvZHVjdC1mZWF0dXJlcyA+ICoge1xuICB3aWR0aDogNjBweDtcbiAgbWFyZ2luOiA1cHggMTBweCAwIDA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi5wcm9kdWN0LWV4dHJhcyA+ICoge1xuICBkaXNwbGF5OiBibG9jaztcbiAgbWFyZ2luOiA4cHggMCAwIDA7XG4gIHdpZHRoOiAxNzBweDtcbn1cblxuLnByb2R1Y3QtaW5mb3JtYXRpb25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xufVxuXG4ucHJvZHVjdC1hY3Rpb25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xufVxuXG4uY3VycmVuY3ktdGFnIHtcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcbn1cblxuLnByaWNlLXRhZyB7XG4gIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XG4gIGZvbnQtd2VpZ2h0OiA5MDA7XG59XG5cbi5wZXItbmlnaHQge1xuICBmb250LXNpemU6IHNtYWxsO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 3351:
/*!*****************************!*\
  !*** ./src/app/products.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "products": () => (/* binding */ products)
/* harmony export */ });
const products = [{
  id: 1,
  name: 'Deluxe double room',
  price: 299,
  description: 'A large bedroom with one of the best view over the city - 25m2 - desk - free wifi - non-smoking room',
  img: {
    src: 'https://danaberez.com/wp-content/uploads/2019/01/Where-to-Stay-in-NYC-Hotel-Indigo-Lower-East-Side.jpg'
  }
}, {
  id: 2,
  name: 'Deluxe simple loft',
  price: 449,
  description: 'A double bedroom in a loft environment with view - 35-40m2 - mini-bar - free wifi - non-smoking loft',
  img: {
    src: 'https://media-cdn.tripadvisor.com/media/photo-s/1c/d7/6e/56/interior-view-of-lounge.jpg'
  }
}, {
  id: 3,
  name: 'Deluxe double loft',
  price: 499,
  description: '2 double bedroom in a loft environment with ocean view - 60m2 - free wifi - non-smoking room',
  img: {
    src: 'https://cdn.concreteplayground.com/content/uploads/2022/04/bondi-view_airbnb-1-1920x1080.jpg'
  }
}];

/***/ }),

/***/ 4097:
/*!**********************************************!*\
  !*** ./src/app/top-bar/top-bar.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TopBarComponent": () => (/* binding */ TopBarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4565);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 8298);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 7681);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ 1027);




const _c0 = function () {
  return ["/home"];
};
class TopBarComponent {}
TopBarComponent.ɵfac = function TopBarComponent_Factory(t) {
  return new (t || TopBarComponent)();
};
TopBarComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: TopBarComponent,
  selectors: [["app-top-bar"]],
  decls: 13,
  vars: 2,
  consts: [[3, "routerLink"], [1, "nav-menu"], ["mat-icon-button", "", "color", "primary", "aria-label", "Example icon-button with menu icon", "routerLink", "/product-list", 1, "example-icon"], ["mat-icon-button", "", "color", "primary", "aria-label", "Example icon-button with menu icon", "routerLink", "/checkout", 1, "example-icon"], ["mat-icon-button", "", "color", "primary", "aria-label", "Example icon-button with menu icon", "routerLink", "/home", 1, "example-icon"]],
  template: function TopBarComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 0)(1, "h1");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Online Travel Agency");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 1)(4, "button", 2)(5, "mat-icon");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "view_list");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 3)(8, "mat-icon");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "shopping_cart");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 4)(11, "mat-icon");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "home");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIcon],
  styles: [".nav-menu[_ngcontent-%COMP%] {\r\n}\n/*# sourceURL=webpack://./src/app/top-bar/top-bar.component.css */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdG9wLWJhci90b3AtYmFyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi5uYXYtbWVudSB7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 287);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 6747);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map