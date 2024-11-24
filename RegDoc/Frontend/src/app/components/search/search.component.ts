import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search.component.html',
})
export class SearchComponent {
    query: string = '';
    results: any[] = [];
    isLoading = false;
    isError = false;

    constructor(private dataService: DataService) {}

    onSearch(): void {
        this.isLoading = true;
        this.isError = false;
        this.dataService.searchFiles(this.query).subscribe({
            next: (response) => {
                this.results = response;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Search failed', error);
                this.isLoading = false;
                this.isError = true;
            },
        });
    }
}
