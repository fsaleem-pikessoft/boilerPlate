export interface FAQ {
    id: number;
    title: string;
    description: string;
    industryId: number | null;
    createdAt: string;
    updatedAt: string;
    type: string;
  }
  
 export interface JobDetailResponse {
    faq: {
      records: FAQ[];
    };
    hasVideoQuestion: boolean;
  }