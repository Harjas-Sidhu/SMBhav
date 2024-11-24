import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DataService {
    constructor(private http: HttpClient) {}

    baseUrl =
        "https://doc-block-backend.vercel.app";

    /**
     * Store a file on the server
     * @param file The file to store
     * @returns The response from the server
     * @example
     *      storeFile(file).subscribe(response => {
     *          console.log(response);
     *      });
     */
    storeFile(file: any) {
        const formData = new FormData();
        formData.append("file", file);

        return this.http.post(`${this.baseUrl}/upload`, formData);
    }

    /**
     * Verify a file on the server
     * @param file The file to verify
     * @returns The response from the server
     * @example
     *      verifyFile(file).subscribe(response => {
     *          console.log(response);
     *      });
     */
    verifyFile(file: any) {
        const formData = new FormData();
        formData.append("file", file);

        return this.http.post(`${this.baseUrl}/verify`, formData);
    }

    /**
     * Get the timeline from the server
     * @returns The response from the server
     * @example
     *      getTimeline().subscribe(response => {
     *          console.log(response);
     *      });
     */
    getTimeline() {
        return this.http.get(`${this.baseUrl}/getAllFiles`);
    }

    /**
     * Download a file from a link
     * @param link The link to download the file from
     * @returns The file from the link
     * @example
     *      downloadFile("http://localhost:3000/download").subscribe(response => {
     *          console.log(response);
     *      });
     */
    downloadFile(link: string): Observable<Blob> | null {
        link = new URL(link).href;
        if (link) {
            return this.http.get<Blob>(link, {
                responseType: "blob" as "json",
            });
        }
        return null;
    }
}
