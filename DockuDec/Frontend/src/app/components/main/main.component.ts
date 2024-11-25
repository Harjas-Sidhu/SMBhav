import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataService } from "../../services/data.service";
import {
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from "@angular/forms";
import { TimelineComponent } from "../timeline/timeline.component";

@Component({
    selector: "app-main",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TimelineComponent],
    templateUrl: "./main.component.html",
})
export class MainComponent {
    storeFileForm!: FormGroup;
    verifyFileForm!: FormGroup;
    fileToStore!: File;
    fileToVerify!: File;

    loading = false;
    uploadStatus: { success: boolean; error: boolean; message: string } | null =
        null;
    verifyStatus: { success: boolean; error: boolean; message: string } | null =
        null;

    constructor(private data: DataService) {}

    ngOnInit(): void {
        this.storeFileForm = new FormGroup({
            file: new FormControl(null, Validators.required),
        });

        this.verifyFileForm = new FormGroup({
            file: new FormControl(null, Validators.required),
        });
    }

    onFileToStoreChange(event: any) {
        if (event.target.files.length > 0) {
            this.fileToStore = event.target.files[0];
        }
    }

    onFileToVerifyChange(event: any) {
        if (event.target.files.length > 0) {
            this.fileToVerify = event.target.files[0];
        }
    }

    onStoreFileSubmit() {
        if (this.storeFileForm.invalid) return;

        this.loading = true;
        this.uploadStatus = null;

        this.data.storeFile(this.fileToStore).subscribe({
            next: (response: any) => {
                this.loading = false;
                if (response.success) {
                    this.uploadStatus = {
                        success: true,
                        error: false,
                        message: response.message + "Timestamp: " + response.timestamp,
                    };
                } else {
                    this.uploadStatus = {
                        success: false,
                        error: true,
                        message: response.message,
                    };
                }
            },
            error: (error) => {
                this.loading = false;
                this.uploadStatus = {
                    success: false,
                    error: true,
                    message: error.message,
                };
            },
        });
    }

    async onVerifyFileSubmit() {
        if (this.verifyFileForm.invalid) return;

        this.loading = true;
        this.verifyStatus = null;

        this.data.verifyFile(this.fileToVerify).subscribe({
            next: (response: any) => {
                this.loading = false;
                if (response.success) {
                    this.verifyStatus = {
                        success: true,
                        error: false,
                        message: response.message + "Timestamp: " + response.timestamp,
                    };
                } else {
                    this.verifyStatus = {
                        success: false,
                        error: true,
                        message: response.message,
                    };
                }
            },
            error: (error) => {
                this.loading = false;
                this.verifyStatus = {
                    success: false,
                    error: true,
                    message: error.message,
                };
            },
        });
    }
}
