import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    /**
     * Register a package
     * @param packageId The package ID
     * @returns The response from the server
     * @example
     *      registerPackage('1234')
     *      // => { success: true }
     */
    registerPackage(packageId: string) {
        return this.http.post('http://localhost:3000/register-package/', {
            packageId,
        });
    }

    /**
     * Register an authority
     * @param authorityAddress The authority address
     * @param name The authority name
     * @returns The response from the server
     * @example
     *      registerAuthority('0x1234', 'Authority 1')
     *      // => { success: true }
     */
    registerAuthority(authorityAddress: string, name: string) {
        return this.http.post('http://localhost:3000/register-authority/', {
            authorityAddress,
            name,
        });
    }

    /**
     * Generate a QR code
     * @param packageId The package ID
     * @returns The response from the server
     * @example
     *      generateQRCode('1234')
     *      // => { success: true }
     */
    generateQRCode(packageId: string) {
        return this.http.post('http://localhost:3000/generate', {
            packageId,
        });
    }

    /**
     * Scan a package using its QR code
     * @param packageId The package ID
     * @param process The current process (e.g., 'scanned')
     * @returns The response from the server
     * @example
     *      scanPackage('1234', 'scanned')
     *      // => { success: true, message: 'Package scanned' }
     */
    scanPackage(packageId: string, process: string) {
        return this.http.post('http://localhost:3000/scan-package', {
            packageId,
            process,
        });
    }
}
