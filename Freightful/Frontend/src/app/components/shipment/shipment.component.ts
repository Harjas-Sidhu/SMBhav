import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shipment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './shipment.component.html',
})
export class ShipmentComponent implements OnInit {
    shipment = {
        shipmentId: '',
        origin: '',
        destination: '',
        weight: 0,
        dimensions: '',
        status: '',
    };
    loading = false;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {}

    createShipment() {
        this.loading = true;
        this.apiService.createShipment(this.shipment).subscribe({
            next: (response: any) => {
                console.log('Shipment created successfully');
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error creating shipment', error);
                this.loading = false;
            },
        });
    }
}
