import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-rates',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './rates.component.html',
})
export class RatesComponent {
    rates: any[] = [];
    loading = true;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getRates().subscribe({
            next: (response: any) => {
                this.loading = false;
                if (response.success) {
                    this.rates = response.rates;
                } else {
                    console.error('Error fetching rates', response);
                }
            },
            error: (error: any) => {
                this.loading = false;
                console.error('Error fetching rates', error);
            },
        });
    }
}
