import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponentComponent } from './landing-component/landing-component.component';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { DocumentComponentComponent } from './document-component/document-component.component';
import { UploadComponentComponent } from './upload-component/upload-component.component';
import { ChatbotComponentComponent } from './chatbot-component/chatbot-component.component';
import { UploadDetailsComponentComponent } from './upload-details-component/upload-details-component.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponentComponent,
    HeaderComponentComponent,
    DocumentComponentComponent,
    UploadComponentComponent,
    ChatbotComponentComponent,
    UploadDetailsComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
