import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  private socket: WebSocket | null = null;
  private dataSubject = new Subject<any>();

  data$ = this.dataSubject.asObservable();



  constructor() {
    this.connectToWebSocket();
   }

   private connectToWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:5000/video_stream');

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.dataSubject.next(data);
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connectToWebSocket(), 1000);
    };
  }

  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

}
