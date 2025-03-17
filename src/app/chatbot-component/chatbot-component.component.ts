import { Component, ViewEncapsulation } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'app-chatbot-component',
  standalone: false,
  templateUrl: './chatbot-component.component.html',
  styleUrl: './chatbot-component.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ChatbotComponentComponent {

  rating = 0;
  hoverRating = 0;
  stars = Array(5).fill(0);
  collapseFlag: boolean = false;
  chatAsked: boolean = false;

  queryHistory: string[] = [];
  responseBot1: string[] = [];
  responseBot2: string[] = [];

  option1Document: string = 'Original';
  option1SelectedLLM: string = 'GPT-3.5-Turbo';
  option2Document: string = 'Curated';
  option2SelectedLLM: string = 'GPT-3.5-Turbo';
  userQueryInput: string = '';
  isSourceCorrect: string = 'Yes';
  isAnswerAccurate: string = 'Yes';
  feedbackComment: string = '';
  successFlag: boolean = false;
  errorFlag: boolean = false;
  errorMsg: string = '';
  processingQueryFlag: boolean = true;

  constructor(public service: DataServiceService) { }

  ngOnInit() {
  }

  // method to calucate the rating provided by user
  rate(value: number) {
    this.rating = value; // Set rating
    console.log(`Rating: ${value}`);
  }

  // method to control view
  toggleCollapseFlag() {
    this.collapseFlag = !this.collapseFlag;
  }

  // API call with query asked for chatbot and getting response
  chatQuery() {
    this.processingQueryFlag = true;
    if (!!this.userQueryInput.trim()) {
      this.chatAsked = true;
      const queryAsked = this.userQueryInput;
      this.queryHistory.push(queryAsked);

      const chatQueryObject = {
        "selection1": {
          "SelectedLLM": this.option1SelectedLLM,
          "DocumentType": this.option1Document
        },
        "selection2": {
          "SelectedLLM": this.option2SelectedLLM,
          "DocumentType": this.option2Document
        },
        "queryHistory": this.queryHistory,
        "responseBot1": this.responseBot1,
        "responseBot2": this.responseBot2,
        "recentQuery": this.userQueryInput
      }


      this.userQueryInput = '';

      this.service.sendchatbotQuery(chatQueryObject).subscribe({
        next: async (response: any) => {
          this.chatCreateResponse("selection-1-container", response.Query1, response.response1, response.references1);
          this.chatCreateResponse("selection-2-container", response.Query2, response.response2, response.references2);
          this.processingQueryFlag = false;
        },
        error: (error: any) => {
          console.error("Error in sending query to chatbot : ", error.message || error);
          if (error.error) {
            console.error("Backend response:", error.error);
          }
        },
        complete: () => {
          console.log("Submitted the query to chatbot succesfully.");
        }
      });

      return;
    }

    this.errorFlag = true;
    this.errorMsg = "Please type your query to proceed.";
    setInterval(() => {
      this.errorFlag = false;
      return;
    }, 3000)
  }

  // method to bind API response for chatbot
  chatCreateResponse(containerSelected: string, query: string, response: string, references: any) {
    const container = document.getElementById(containerSelected);

    if (!container) {
      console.error(`Container with ID ${containerSelected} not found`);
      return;
    }

    const userQueryDiv = document.createElement('div');
    userQueryDiv.classList.add('user-query');
    userQueryDiv.innerHTML = `<i class="bi bi-person-fill"></i> ${query}`;

    const chatbotResponseDiv = document.createElement('div');
    chatbotResponseDiv.classList.add('chatbot-response');
    let responseText = `<i class="bi bi-chat-dots"></i> ${response}`;

    if (references && Object.keys(references).length > 0) {
      responseText += "<br><strong>References:</strong> ";
      for (const [key, value] of Object.entries(references)) {
        responseText += `<a href="${value}" target="_blank">${key}</a> `;
      }
    }

    chatbotResponseDiv.innerHTML = responseText;
    container.appendChild(userQueryDiv);
    container.appendChild(chatbotResponseDiv);

    // Scroll to the bottom of the container
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }


  // method to implement submit feedback logic
  submitChatFeedback() {

    if (!!this.isSourceCorrect && !!this.isAnswerAccurate && this.feedbackComment && this.rating) {
      const submitFeedBackObject = {
        "isSourceCorrect": ((this.isSourceCorrect) === 'Yes' ? true : false),
        "isAnswerAccurate": ((this.isAnswerAccurate) === 'Yes' ? true : false),
        "feedbackComment": this.feedbackComment,
        "ratings": this.rating,
        "queryHistory": this.queryHistory
      }

      this.service.submitChatFeedback(submitFeedBackObject).subscribe({
        next: async (response: any) => {
          if (response.message === 'success' && response.status_code === 200) {
            this.successFlag = true;
          }
        },
        error: (error: any) => {
          console.error("Error in submitting feedback : ", error.message || error);
          if (error.error) {
            console.error("Backend response:", error.error);
          }
        },
        complete: () => {
          console.log("Submitted the feedback succesfully.");
          setTimeout(() => {
            this.successFlag = false;
          }, 3000)
        }
      });

      return;
    }

    this.errorFlag = true;
    this.errorMsg = "Kindly drop in your ratings and submit a feedback.";
    setInterval(() => {
      this.errorFlag = false;
      return;
    }, 3000)

  }

  // method to clear chat
  clearChat() {
    this.chatAsked = false;
    const containers = ['selection-1-container', 'selection-2-container'];

    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = "";
      }
    });
  }

  ngOnDestroy() { }

}
