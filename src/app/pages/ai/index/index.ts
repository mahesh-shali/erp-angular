import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

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
  messages: { sender: 'user' | 'ai'; text: string }[] = [];

  @Output() send = new EventEmitter<string>();
  section: string | null = null;
  private aiUrl = environment.aiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Any init logic goes here
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
      .get<any>(`${this.aiUrl}/ai/ask?q=${encodeURIComponent(userMessage)}`)
      .subscribe({
        next: (res) => {
          this.messages.push({ sender: 'ai', text: res.response });
        },
        error: () => {
          this.messages.push({
            sender: 'ai',
            text: '⚠️ Error connecting to AI API',
          });
        },
      });
  }
}
