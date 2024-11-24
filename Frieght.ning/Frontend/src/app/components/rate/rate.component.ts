import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rate',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rate.component.html',
})
export class RateComponent {
    rate = {
        rateId: '',
        carrierId: '',
        price: 0,
        transitTime: '',
        shipmentId: '',
        conditions: '',
    };
    loading = false;

    constructor(private apiService: ApiService) {}

    addRate() {
        this.loading = true;
        this.apiService.addRate(this.rate).subscribe({
            next: (response: any) => {
                console.log('Rate added successfully');
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error adding rate', error);
                this.loading = false;
            },
        });
    }
}
