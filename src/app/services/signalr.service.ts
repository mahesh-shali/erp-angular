import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  messages: { user: string; text: string }[] = [];

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5133/chatHub', {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR Error:', err));

    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.messages.push({ user, text: message });
    });
  }

  sendMessage(user: string, message: string): void {
    this.hubConnection
      .invoke('SendMessage', user, message)
      .catch((err) => console.error(err));
  }
}
