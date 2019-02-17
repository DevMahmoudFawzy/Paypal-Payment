import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {

  paymentID;
  executeSubscription: Subscription;
  payerID;
  isLoading = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.paymentID = this.route.snapshot.queryParams['paymentId'];
    this.payerID = this.route.snapshot.queryParams['PayerID'];
    this.executeSubscription = this.http.post('http://localhost:3000/paypal/execute', { PaymentID: this.paymentID, PayerID: this.payerID })
      .subscribe(
        (response) => {
          console.log(response);
          this.isLoading = false;
          this.message = 'Your Payment Transfered Successfully !!';
        },
        (fail) => {
          console.log(fail);
          this.isLoading = false;
          this.message = 'Something Went Wrong, try again later !!';
        }
      );
  }

  ngOnDestroy() {
    if (this.executeSubscription) {
      this.executeSubscription.unsubscribe();
    }
  }

}
