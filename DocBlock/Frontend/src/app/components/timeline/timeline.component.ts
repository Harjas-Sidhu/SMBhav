import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataService } from "../../services/data.service";
import FileTimeline from "../../interfaces/file-timeline.interface";
import mime from "mime";
import { saveAs } from "file-saver";

@Component({
    selector: "app-timeline",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./timeline.component.html",
})
export class TimelineComponent {
    timeline: FileTimeline[] = [];

    constructor(private data: DataService) {
        this.loadTimeline();
    }

    ngOnInit() {
        this.loadTimeline();
    }

    private loadTimeline() {
        this.data.getTimeline().subscribe((response: any) => {
            if (response.success) {
                this.timeline = response.files;
                this.timeline.forEach((timelineItem) => {
                    timelineItem.timestamp = new Date(timelineItem.timestamp);
                });

                this.timeline.sort((a, b) => b.timestamp - a.timestamp);
            }
        });
    }

    onClick(link: string) {
        try {
            const fileName = link.split("/").pop() as string;
            const mimeType = mime.getType(fileName);
            console.log(mimeType, fileName);
            if (mimeType) {
                this.data.downloadFile(link)?.subscribe((response) => {
                    const blob = response;
                    const fileContent = new Blob([blob], { type: mimeType });
                    saveAs(fileContent, fileName);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}
