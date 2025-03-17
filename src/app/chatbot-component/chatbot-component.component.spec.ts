import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotComponentComponent } from './chatbot-component.component';

describe('ChatbotComponentComponent', () => {
  let component: ChatbotComponentComponent;
  let fixture: ComponentFixture<ChatbotComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
