import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Component({
    selector: 'app-scan-package',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './scan-package.component.html',
})
export class ScanPackageComponent {
    qrCodeUrl: string | null = null;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    private qrCodeScanner: Html5QrcodeScanner | null = null;

    constructor(private data: DataService) {}

    ngOnInit(): void {
        this.initQRScanner();
    }

    ngOnDestroy(): void {
        if (this.qrCodeScanner) {
            this.qrCodeScanner.clear();
        }
    }

    private initQRScanner(): void {
        this.qrCodeScanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: 250,
            },
            false
        );

        this.qrCodeScanner.render(
            (qrCode) => this.onScanSuccess(qrCode),
            (errorMessage) => this.onScanError(errorMessage)
        );
    }

    private onScanSuccess(qrCode: string): void {
        this.qrCodeUrl = `http://localhost:3000/qrcodes/${qrCode}.png`;

        this.data.scanPackage(qrCode, 'scanned').subscribe({
            next: (response: any) => {
                if (response.success) {
                    this.successMessage = `Package ${qrCode} scanned successfully with process: ${response.message}`;
                } else {
                    this.errorMessage = response.message;
                }
            },
            error: (error: any) => {
                this.errorMessage = error.error.message;
                console.log(error);
            },
        });
    }

    private onScanError(errorMessage: string): void {
        this.errorMessage = `Scan error: ${errorMessage}`;
    }
}
