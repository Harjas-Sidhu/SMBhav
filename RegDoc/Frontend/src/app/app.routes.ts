import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
    { path: 'file-upload', component: FileUploadComponent },
    { path: 'search', component: SearchComponent },
    { path: '', redirectTo: '/file-upload', pathMatch: 'full' },
];
