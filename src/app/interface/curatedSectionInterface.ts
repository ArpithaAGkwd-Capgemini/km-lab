export interface CuratedSection {
    Title: string;
    Content: string;
    Metadata: {
        "IntentL1": string;
        "IntentL2": string;
        "IntentL3": string;
        Tags: string[];
        Labels: string[];
        RegionApplicability: string[];
        Language: string[];
        ComplianceLegalNotes: string[];
        AccessControlPermissions: string[];
    };
    Checks: {
        SpellChecks: Record<string, string>;
        GrammarChecks: Record<string, string>;
        AcronymChecks: Record<string, string>;
    };
}

export type CuratedSections = Record<string, CuratedSection>;
