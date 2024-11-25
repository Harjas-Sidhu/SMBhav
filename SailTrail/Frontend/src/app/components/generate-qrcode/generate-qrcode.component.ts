import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-generate-qrcode',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './generate-qrcode.component.html',
})
export class GenerateQrcodeComponent {
    packageId: string = '';
    successMessage: string = '';
    errorMessage: string = '';
    qrCodeUrl: string = '';

    constructor(private dataService: DataService) {}

    generateQRCode() {
        if (this.packageId) {
            this.dataService.generateQRCode(this.packageId).subscribe({
                next: (response: any) => {
                    if (response.success) {
                        this.qrCodeUrl = `http://localhost:3000/qrcodes/${this.packageId}.png`;
                        this.successMessage = 'QR code generated successfully!';
                        this.errorMessage = '';
                    } else {
                        this.errorMessage = response.message;
                        this.successMessage = '';
                    }
                },
                error: (error: any) => {
                    this.errorMessage = error.message;
                    this.successMessage = '';
                },
            });
        } else {
            this.errorMessage = 'Package ID is required';
            this.successMessage = '';
        }
    }
}
