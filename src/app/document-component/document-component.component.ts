import { Component } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'app-document-component',
  standalone: false,
  templateUrl: './document-component.component.html',
  styleUrl: './document-component.component.css'
})

export class DocumentComponentComponent {

  documents: any[] = [];
  filteredDocuments = [...this.documents];
  currentPage = 0;
  recordsPerPage = 8;
  documentSearch: string = "";

  constructor(public service: DataServiceService) { }

  ngOnInit() {
    this.getDocumentsOnload();
  }

  // API call to get all documents info from backend
  getDocumentsOnload() {
    this.service.getAllDocuments().subscribe({
      next: async (response: any) => {

        this.documents = response.map((doc: any) => ({
          Name: doc.filename,
          Date: doc.date_added,
          Author: doc.user,
          UrlCurated: doc.URL_Curated,
          UrlOriginal: doc.URL_Original
        }));

        this.filteredDocuments = [...this.documents];
      },
      error: (error: any) => {
        console.error("Error fetching documents:", error.message);
      },
      complete: () => {
        console.log("Fetched and transformed document details.");
      }
    });
  }

  // Calculate total pages dynamically based on filtered results
  get totalPages(): number {
    return Math.ceil(this.filteredDocuments.length / this.recordsPerPage);
  }

  // Get the current page's records from the filtered list
  get paginatedDocuments() {
    const startIndex = this.currentPage * this.recordsPerPage;
    return this.filteredDocuments.slice(startIndex, startIndex + this.recordsPerPage);
  }

  // Navigate to the previous page
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // Navigate to the next page
  nextPage() {
    if (this.currentPage < (this.totalPages - 1)) {
      this.currentPage++;
    }
  }

  // Filter documents based on the search input
  filterDocument() {
    this.currentPage = 0;
    if (this.documentSearch.trim() === "") {
      this.filteredDocuments = [...this.documents];
    } else {
      this.filteredDocuments = this.documents.filter(doc =>
        doc.Name.toLowerCase().includes(this.documentSearch.toLowerCase())
      );
    }
  }

}

