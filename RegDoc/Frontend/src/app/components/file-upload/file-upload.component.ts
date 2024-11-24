import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
    selectedFile: File | null = null;
    isLoading = false;
    isSuccess = false;
    isError = false;

    constructor(private dataService: DataService) {}

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    onUpload(): void {
        if (this.selectedFile) {
            this.isLoading = true;
            this.isSuccess = false;
            this.isError = false;
            this.dataService.uploadFile(this.selectedFile).subscribe({
                next: (response) => {
                    console.log('File uploaded successfully', response);
                    this.isLoading = false;
                    this.isSuccess = true;
                },
                error: (error) => {
                    console.error('File upload failed', error);
                    this.isLoading = false;
                    this.isError = true;
                },
            });
        }
    }
}
