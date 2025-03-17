import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { CuratedSections } from '../interface/curatedSectionInterface';

@Component({
  selector: 'app-upload-details-component',
  standalone: false,
  templateUrl: './upload-details-component.component.html',
  styleUrl: './upload-details-component.component.css'
})

export class UploadDetailsComponentComponent {

  @ViewChild('documentContainerOriginal') documentContainerOriginal!: ElementRef;

  documentInfo: any = {};
  editFlag: boolean = true;
  editFlagFinalReview: boolean = true;
  curated: boolean = true;
  intentFlag: boolean = true;
  detailsView: boolean = true;
  lifecycleViewFlag: boolean = true;
  errorMessage: string = "";
  intentL1: string = "intents l1 value in string";
  accordionItems: { id: string; title: string; isOpen: boolean; subItems: string[] }[] = [];
  curatedSections: CuratedSections = {};
  sectionKeys: string[] = [];
  currentSectionIndex: number = 0;
  currentSection: string = '';
  sendObject!: { documentInfo: any; curatedSections: CuratedSections; };
  router: any;
  finalReviewContent: string = '';
  documentMetadata: any;
  hrefURL: any;
  isSubmitting: boolean = false;
  isDownloading: boolean = false;
  isUploading: boolean = false;
  successFlag: boolean = false;

  constructor(public service: DataServiceService) { }

  // angular lifecycle method
  ngOnInit() {
    this.bindDataOnPageLoad();
  }

  // method to bind data on page load API call
  bindDataOnPageLoad() {
    const { filename, extension, URL, LLM } = sessionStorage;
    this.documentInfo = { filename, extension, URL, LLM };

    if (!filename || !URL || !LLM) {
      console.error("Missing required documentInfo properties!");
      return;
    }

    const payload = { documentInfo: this.documentInfo };

    this.service.getCuratedData(payload).subscribe({
      next: async (response: any) => {
        this.accordionItems = response.accordianItems;
        this.curatedSections = this.transformApiResponse(response.curatedSections);

        // Update sectionKeys and reset index when new data is loaded
        this.sectionKeys = Object.keys(this.curatedSections);
        this.currentSectionIndex = 0;
        this.currentSection = this.sectionKeys[this.currentSectionIndex];
      },
      error: (error: any) => {
        console.error("Curated section details error:", error.message || error);
        if (error.error) {
          console.error("Backend response:", error.error);
        }
      },
      complete: () => {
        console.log("Curated section details fetched.");
      }
    });
  }

  // method to format data and bind it to HTML View
  transformApiResponse(apiResponse: any[]) {
    const transformedData = apiResponse.reduce((acc, item, index) => {
      acc[`Section-${index + 1}`] = {
        Title: item.title,
        Content: item.content.trim(),
        Metadata: {
          IntentL1: item.Metadata.IntentL1 || "",
          IntentL2: item.Metadata.IntentL2 || "",
          IntentL3: item.Metadata.IntentL3 || "",
          Tags: item.Metadata.Tags || [],
          Labels: item.Metadata.Labels || [],
          RegionApplicability: item.Metadata.Region_Applicability || [],
          Language: item.Metadata.Language || [],
          ComplianceLegalNotes: item.Metadata.Compliance_Or_Legal_Notes || [],
          AccessControlPermissions: item.Metadata.Access_Control_Permissions || []
        },
        Checks: {
          "SpellChecks": item.Checks?.SpellChecks || {},
          "GrammarChecks": item.Checks?.GrammarChecks || {},
          "AcronymChecks": item.Checks?.AcronymChecks || {}
        }
      };
      return acc;
    }, {});

    return transformedData;
  }

  // method to get the original pdf view and bind it to screen
  loadUploadedFile() {
    const fileType = sessionStorage.getItem("fileType");
    const fileUrl = sessionStorage.getItem("pdfFile");

    if (!fileUrl) {
      this.errorMessage = 'File URL not found in session storage.';
      return;
    }

    const documentContainerElement = this.documentContainerOriginal?.nativeElement;

    if (!documentContainerElement) {
      this.errorMessage = 'Document container not found.';
      return;
    }

    documentContainerElement.innerHTML = '';

    if (fileType === 'application/pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = fileUrl;
      iframe.width = '100%';
      iframe.height = '700px';
      documentContainerElement.appendChild(iframe);
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      iframe.width = '100%';
      iframe.height = '600px';
      documentContainerElement.appendChild(iframe);
    } else {
      this.errorMessage = 'Unsupported file type. Please upload a PDF or Word document.';
    }
  }

  getKeys(obj: Record<string, string>): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // method navigate between section in curated section screen
  prevSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.currentSection = this.sectionKeys[this.currentSectionIndex];
    }
  }

  // method navigate between section in curated section screen
  nextSection() {
    if (this.currentSectionIndex < this.sectionKeys.length - 1) {
      this.currentSectionIndex++;
      this.currentSection = this.sectionKeys[this.currentSectionIndex];
    }
  }

  // method to toggle between tabs for curated section/orginal preview
  switchSectionOriginal() {
    this.curated = false;
    this.loadUploadedFile();
  }

  // method to toggle between tabs for curated section/orginal preview
  switchSectionCurated() {
    this.curated = true;
  }

  // method to toggle between tabs for curated section between intent tab and classification tab
  switchIntentTab() {
    this.intentFlag = true;
  }

  // method to toggle between tabs for curated section between intent tab and classification tab
  switchClassificationTab() {
    this.intentFlag = false;
  }

  // method to edit metadata on curated section screen
  editToggle() {
    this.editFlag = !this.editFlag;
  }

  // method to toggle view between curated section and final review screen
  toggleCuratedFinalReviewScreen() {
    this.detailsView = !this.detailsView;
  }

  // method to toggle flag to edit metadata on final review screen
  editFlagFinalReviewToggle() {
    this.editFlagFinalReview = !this.editFlagFinalReview;
  }

  // method to submit modified curated data and go to final review screen
  submitData() {
    this.isSubmitting = true;
    this.sendObject = {
      "documentInfo": this.documentInfo,
      "curatedSections": this.curatedSections
    };

    this.service.getFinalReviewData(this.sendObject).subscribe({
      next: async (response: any) => {
        this.finalReviewContent = response.consolidatedView;
        this.documentMetadata = response.documentMetadata;
        this.toggleCuratedFinalReviewScreen();
      },
      error: (error: any) => {
        console.error("Final Review Screen error details:", error.message || error);
        if (error.error) {
          console.error("Backend response:", error.error);
        }
      },
      complete: () => {
        console.log("Final Review Screen Loaded Successfully.");
        this.isSubmitting = false;
      }
    });
  }

  // method to toggle between tabs for final review screen between lifecycle tab and identification tab
  switchLifecycleTab() {
    this.lifecycleViewFlag = true;
  }

  // method to toggle between tabs for final review screen between lifecycle tab and identification tab
  switchIdentificationTab() {
    this.lifecycleViewFlag = false;
  }

  // method to get the link to download curated pdf
  downloadDocument() {
    this.isDownloading = true;
    const documentDownloadObject = {
      "documentInfo": this.documentInfo,
      "documentMetadata": this.documentMetadata
    };

    this.service.generateDocumentFinalReviewUrl(documentDownloadObject).subscribe({
      next: async (response: any) => {
        this.hrefURL = response.URL;
      },
      error: (error: any) => {
        console.error("Error in fetching pdf URL for downloading:", error.message || error);
        if (error.error) {
          console.error("Backend response:", error.error);
        }
      },
      complete: () => {
        console.log("Fetched PDF URL for downloading document.");
        this.isDownloading = false;
      }
    });
  }

  // method to call upload file/data in knowledge database
  uploadToKnowledgeDatabase() {
    this.isUploading = true;
    const uploadToKnowledgeDatabase = {
      "documentInfo": this.documentInfo,
      "documentMetadata": this.documentMetadata
    };

    this.service.uploadToKnowledgeDb(uploadToKnowledgeDatabase).subscribe({
      next: async (response: any) => {
      },
      error: (error: any) => {
        console.error("Error in uploading to knowledge database:", error.message || error);
        if (error.error) {
          console.error("Backend response:", error.error);
        }
      },
      complete: () => {
        console.log("Uploaded to knowledge database.");
        this.isUploading = false;
        this.successFlag = true;
        setTimeout(() => {
          this.successFlag = false;
        }, 3000)
      }
    });
  }
}
