import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { Router } from '@angular/router';  // ✅ Import Router

@Component({
  selector: 'app-upload-component',
  standalone: false,
  templateUrl: './upload-component.component.html',
  styleUrl: './upload-component.component.css'
})

export class UploadComponentComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('documentContainer') documentContainer!: ElementRef;

  errorMessage: string = "";
  fileData: any;
  selectedLLM: string = 'GPT-4o-Mini';
  isDescriptionEnabled: boolean = false;
  processing: boolean = false;
  showTooltip: boolean = false;
  isUploading: boolean = false;

  constructor(public service: DataServiceService, public route: Router) { }

  ngOnInit() { }

  // method for customised tooltio
  toggleTooltip(state: boolean) {
    this.showTooltip = state;
  }

  // method to reset error-message
  clearError() {
    this.errorMessage = '';
  }

  // method for upload-file logic and API call
  async uploadFile() {
    const fileInputElement = this.fileInput?.nativeElement;

    if (!fileInputElement || !fileInputElement.files || fileInputElement.files.length === 0) {
      this.errorMessage = 'Please select a document to upload.';
      return;
    }

    const file = fileInputElement.files[0];

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      this.errorMessage = 'File size exceeds 100MB. Please upload a smaller file.';
      return;
    }

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('Description', this.isDescriptionEnabled ? 'true' : 'false');
    formData.append('LLM', this.selectedLLM);

    this.service.uploadFile(formData).subscribe({
      next: async (response: any) => {
        sessionStorage.setItem("LLM", response?.documentInfo.LLM);
        sessionStorage.setItem("URL", response?.documentInfo.URL);
        sessionStorage.setItem("extension", response?.documentInfo.extension);
        sessionStorage.setItem("filename", response?.documentInfo.filename);
        sessionStorage.setItem("fileType", file.type);
        const blob = await file.arrayBuffer();
        const pdfBlob = new Blob([blob], { type: file.type });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        sessionStorage.setItem("pdfFile", pdfUrl);
        this.route.navigate(['/upload-details']);
      },
      error: (error: any) => {
        console.error("Upload failed:", error);
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }

  ngOnDestroy() { }

}
