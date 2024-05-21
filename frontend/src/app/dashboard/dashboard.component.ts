import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  imageUrl: any;
  visibleInside: number = 0;
  visibleOutside: number = 0;
  totalEntries: number = 0;
  private socket: WebSocket | null = null;

  ngOnInit(): void {
    this.connectToWebSocket();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  connectToWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:5000/video_stream');

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.imageUrl = `data:image/jpeg;base64,${data.data}`;
      this.visibleInside = data.vis_in;
      this.visibleOutside = data.vis_out;
      this.totalEntries = data.tot_in;
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connectToWebSocket(), 1000);
    };
  }
}
