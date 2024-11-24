import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-auction',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './auction.component.html',
})
export class AuctionComponent implements OnInit {
    auction = {
        auctionId: '',
        shipmentId: '',
        startTime: '',
        endTime: '',
        bids: [],
    };

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {}

    startAuction() {
        this.apiService.startAuction(this.auction).subscribe({
            next: (response: any) => {
                console.log('Auction started successfully');
            },
            error: (error: any) => {
                console.error('Error starting auction', error);
            },
        });
    }
}
