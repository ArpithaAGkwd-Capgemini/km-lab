import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataServiceService {

  private apiUrlLocal = 'http://0.0.0.0:8001';  // Base API URL
  private apiUrlProduction = '';

  private apiUrlUpload = 'uploadfile';
  private apiUrlCurated = 'curatefile';
  private apiUrlFinalReview = 'reviewdoc';
  private apiUrlDocumentDownloadFinalReview = 'generatedoc';
  private apiUrlUploadToKnowledgeDatabase = 'indexdoc';
  private apiUrlGetAllDocuments = 'getdocs';
  private apiUrlChatbotQuery = 'chatresponse';
  private apiUrlChatbotFeedback = 'chatfeedback';

  
  constructor(private http: HttpClient) { }

  private getFullUrl(endpoint: string): string {
    return `${this.apiUrlLocal}/${endpoint}`;
  }

  uploadFile(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlUpload), fileData);
  }

  getCuratedData(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlCurated), fileData);
  }

  getFinalReviewData(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlFinalReview), fileData);
  }

  generateDocumentFinalReviewUrl(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlDocumentDownloadFinalReview), fileData);
  }

  uploadToKnowledgeDb(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlUploadToKnowledgeDatabase), fileData);
  }

  getAllDocuments() {
    return this.http.get<any>(this.getFullUrl(this.apiUrlGetAllDocuments));
  }

  sendchatbotQuery(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlChatbotQuery), fileData);
  }

  submitChatFeedback(fileData: any): Observable<any> {
    return this.http.post<any>(this.getFullUrl(this.apiUrlChatbotFeedback), fileData);
  }
}
