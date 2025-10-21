import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalRService } from 'src/app/services/signalr.service';
//import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss',
})
export class ChatWidget {
  isOpen = false;
  user = 'admin'; // Replace this with the logged-in user
  input = '';

  constructor(public signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }

  sendMessage() {
    if (!this.input.trim()) return;
    this.signalRService.sendMessage(this.user, this.input);
    this.input = '';
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}
