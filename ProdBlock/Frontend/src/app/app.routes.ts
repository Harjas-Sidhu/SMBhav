import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterPackageComponent } from './components/register-package/register-package.component';
import { RegisterAuthorityComponent } from './components/register-authority/register-authority.component';
import { GenerateQrcodeComponent } from './components/generate-qrcode/generate-qrcode.component';
import { ScanPackageComponent } from './components/scan-package/scan-package.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register-package', component: RegisterPackageComponent },
    { path: 'register-authority', component: RegisterAuthorityComponent },
    { path: 'generate-qrcode', component: GenerateQrcodeComponent },
    { path: 'scan-package', component: ScanPackageComponent },
];
