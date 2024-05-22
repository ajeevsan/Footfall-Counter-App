import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTransferService } from '../service/data-transfer.service';

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
  private dataSubscription: any;


  constructor(private dataTransferService: DataTransferService) { }

  ngOnInit(): void {
    this.dataSubscription = this.dataTransferService.data$.subscribe(data => {
      this.imageUrl = `data:image/jpeg;base64,${data.data}`;
      this.visibleInside = data.vis_in;
      this.visibleOutside = data.vis_out;
      this.totalEntries = data.tot_in;
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.dataTransferService.closeConnection();
  }
}
