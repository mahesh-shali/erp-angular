import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';
declare var Razorpay: any;
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})
export class Index implements OnInit {
  message: string = '';
  started = false;
  userId = 1;
  isPaid = false;
  messages: { sender: 'user' | 'ai'; text: string }[] = [];
  selectedPlan: { name: string; amount: number } | null = null;
  loading = true;

  paymentOptions = [
    { name: 'Basic', amount: 1000 * 100 },
    { name: 'Standard', amount: 2000 * 100 },
    { name: 'Premium', amount: 3000 * 100 },
  ];

  @Output() send = new EventEmitter<string>();
  section: string | null = null;
  private aiUrl = environment.aiUrl;

  constructor(
    private http: HttpClient,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // this.paymentService.checkPaymentStatus(this.userId).subscribe((res) => {
    //   this.isPaid = res.isPaid;
    //   if (!this.isPaid) {
    //     this.started = true;
    //     this.loading = false;
    //   }
    // });
    this.paymentService.checkPaymentStatus(this.userId).subscribe(
      (res) => {
        this.isPaid = res.isPaid;
        this.started = this.isPaid;
        this.loading = false;
      },
      (error) => {
        console.error('Error checking payment status', error);
        this.loading = false;
      }
    );
  }

  pay(amount: number) {
    this.paymentService.createOrder(amount, this.userId).subscribe((order) => {
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'AI Chat',
        order_id: order.orderId,
        handler: (response: any) => {
          this.paymentService
            .verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            .subscribe((verifyRes) => {
              if (verifyRes.success) {
                this.isPaid = true;
                this.started = true;
              } else {
                alert('Payment verification failed');
              }
            });
        },
        prefill: { name: 'Test User', email: 'test@example.com' },
        theme: { color: '#3399cc' },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
  selectPlan(plan: { name: string; amount: number }) {
    this.selectedPlan = plan;
  }

  sendMessage() {
    if (!this.message.trim()) return;

    if (!this.started) {
      this.started = true;
    }

    this.messages.push({ sender: 'user', text: this.message });

    const userMessage = this.message;
    this.message = '';

    this.http
      .post<any>(`${this.aiUrl}/ai/general`, { query: userMessage })
      .subscribe({
        next: (res) => {
          this.messages.push({ sender: 'ai', text: res.response });
        },
        error: (err) => {
          console.error(err);
          this.messages.push({
            sender: 'ai',
            text: '⚠️ Error connecting to AI API',
          });
        },
      });
  }
}
