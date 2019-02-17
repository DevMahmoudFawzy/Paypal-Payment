import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  paySubscription: Subscription;

  products: any[] = [
    {
      Id: 1, Name: 'Acer Predator Helios 500 PH517-51-72NU',
      image: 'https://images-na.ssl-images-amazon.com/images/I/81EEuUyk6yL._SX355_.jpg',
      price: '1,899.00',
      desc: `Gaming Laptop, Intel Core i7-8750H, GeForce GTX 1070 Overclockable Graphics, 17.3" Full HD 144Hz G-Sync Display, 
      16GB DDR4, 256GB PCIe NVMe SSD, 1TB HDD`
    },
    {
      Id: 2, Name: 'Dell Alienware 17 R5',
      image: 'https://images-na.ssl-images-amazon.com/images/I/61qXE7OEM0L._SL1200_.jpg',
      price: '1,599.00',
      desc: `17.3" FHD VR Gaming Laptop Computer, Intel 6Core i7-8750H Up to 4.1GHz, GTX 1070 8GB, Backlit Keyboard, 
      Windows 10, Up to 8GB 16GB 32GB DDR4, 1TB SSHD 128GB 256GB 512GB 1TB SSD`
    }
  ];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  pay(product) {
    this.paySubscription = this.http.post('http://localhost:3000/paypal/pay', { Product: product })
      .subscribe(
        (response: any) => {
          console.log(response);
          window.location.href = response.ApprovalURL;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    if (this.paySubscription) {
      this.paySubscription.unsubscribe();
    }
  }

}
