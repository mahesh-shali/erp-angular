import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  checkPaymentStatus(userId: number): Observable<{ isPaid: boolean }> {
    return this.http.get<{ isPaid: boolean }>(
      `${this.apiUrl}/payment/status/${userId}`,
      { withCredentials: true }
    );
  }

  createOrder(amount: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/payment/create-order`,
      {
        amountInPaise: amount,
        userId: userId,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
  }

  verifyPayment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/verify`, payload, {
      withCredentials: true,
    });
  }
}
