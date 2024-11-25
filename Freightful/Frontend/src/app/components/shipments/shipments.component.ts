import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-shipments',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './shipments.component.html',
})
export class ShipmentsComponent {
    shipments: any[] = [];
    loading = true;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getShipments().subscribe({
            next: (response: any) => {
                this.loading = false
                if(response.success) {
                    this.shipments = response.shipments;
                } else {
                    console.error('Error fetching shipments', response.error);
                }
            },
            error: (error: any) => {
                this.loading = false;
                console.error('Error fetching shipments', error);
            },
        });
    }
}
