import { Routes } from '@angular/router';
import { CarrierRegistrationComponent } from './components/carrier-registration/carrier-registration.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShipmentComponent } from './components/shipment/shipment.component';
import { CarrierComponent } from './components/carrier/carrier.component';
import { RateComponent } from './components/rate/rate.component';
import { AuctionComponent } from './components/auction/auction.component';
import { BidComponent } from './components/bid/bid.component';
import { ShipmentsComponent } from './components/shipments/shipments.component';
import { RatesComponent } from './components/rates/rates.component';
import { AuctionsComponent } from './components/auctions/auctions.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'shipment', component: ShipmentComponent },
    { path: 'shipments', component: ShipmentsComponent },
    { path: 'carriers', component: CarrierComponent },
    { path: 'rates', component: RateComponent },
    { path: 'all-rates', component: RatesComponent },
    { path: 'auction', component: AuctionComponent },
    { path: 'auctions', component: AuctionsComponent },
    { path: 'bid', component: BidComponent },
    { path: 'carrier-registration', component: CarrierRegistrationComponent },
];
