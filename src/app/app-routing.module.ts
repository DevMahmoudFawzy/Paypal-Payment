import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'payment/success', component: PaymentSuccessComponent },
    { path: 'payment/error', component: PaymentErrorComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
