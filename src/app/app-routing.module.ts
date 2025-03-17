import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponentComponent } from './landing-component/landing-component.component';
import { UploadComponentComponent } from './upload-component/upload-component.component';
import { DocumentComponentComponent } from './document-component/document-component.component';
import { ChatbotComponentComponent } from './chatbot-component/chatbot-component.component';
import { UploadDetailsComponentComponent } from './upload-details-component/upload-details-component.component';

const routes: Routes = [
  { path: "", component: LandingComponentComponent },
  { path: "upload", component: UploadComponentComponent },
  { path: "upload-details", component: UploadDetailsComponentComponent },
  { path: "documents", component: DocumentComponentComponent },
  { path: "chatbot", component: ChatbotComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
