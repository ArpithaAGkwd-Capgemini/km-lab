import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDetailsComponentComponent } from './upload-details-component.component';

describe('UploadDetailsComponentComponent', () => {
  let component: UploadDetailsComponentComponent;
  let fixture: ComponentFixture<UploadDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDetailsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


 // for testing purposes only
  // transformApiResponse(apiResponse: any[]) {
  //   const transformedData = apiResponse.reduce((acc, item, index) => {
  //     const sectionKey = `Section-${index + 1}`;

  //     acc[sectionKey] = {
  //       Title: item.title,
  //       Content: item.content.trim(), // Trim unnecessary spaces or newlines
  //       Metadata: {
  //         "Intent L1": item.Metadata?.IntentL1 || "",
  //         "Intent L2": item.Metadata?.IntentL2 || "",
  //         "Intent L3": item.Metadata?.IntentL3 || "",
  //         Tags: item.Metadata?.Tags || [],
  //         Labels: item.Metadata?.Labels || [],
  //         RegionApplicability: item.Metadata?.Region_Applicability || [],
  //         Language: item.Metadata?.Language || [],
  //         ComplianceLegalNotes: item.Metadata?.Compliance_Or_Legal_Notes || [],
  //         AccessControlPermissions: item.Metadata?.Access_Control_Permissions || []
  //       },
  //       Checks: sectionKey === "Section-1" || sectionKey === "Section-3" ? {
  //         "SpellChecks": { "Example": "Corrected Example" },
  //         "GrammarChecks": { "Sentence": "This is a grammatically correct sentence." },
  //         "AcronymChecks": { "AI": "Artificial Intelligence" }
  //       } : {
  //         "SpellChecks": item.Checks?.SpellChecks || {},
  //         "GrammarChecks": item.Checks?.GrammarChecks || {},
  //         "AcronymChecks": item.Checks?.AcronymChecks || {}
  //       }
  //     };

  //     return acc;
  //   }, {} );

  //   return transformedData;
  // }