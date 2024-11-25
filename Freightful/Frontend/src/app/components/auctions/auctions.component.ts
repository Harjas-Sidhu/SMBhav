import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-auctions',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './auctions.component.html',
})
export class AuctionsComponent {
    auctions: any[] = [];
    loading = true;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getAuctions().subscribe({
            next: (response: any) => {
                this.loading = false;
                if (response.success) {
                    this.auctions = response.auctions;
                    console.log('Auctions fetched', response);
                } else {
                    console.error('Error fetching auctions', response.error);
                }
            },
            error: (error: any) => {
                this.loading = false;
                console.error('Error fetching auctions', error);
            },
        });
    }
}
