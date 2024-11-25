import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-bid',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './bid.component.html',
})
export class BidComponent {
    bid = {
        auctionId: '',
        carrierId: '',
        bidAmount: 0,
    };

    constructor(private apiService: ApiService) {}

    placeBid() {
        this.apiService.placeBid(this.bid).subscribe({
            next: (response: any) => {
                console.log('Bid placed successfully');
            },
            error: (error: any) => {
                console.error('Error placing bid', error);
            },
        });
    }
}
