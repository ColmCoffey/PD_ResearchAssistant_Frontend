export interface SubmitQueryRequest {
  query_text: string;
}

export interface QueryResponse {
  query_id: string;
  create_time: number;
  query_text: string;
  answer_text?: string;
  sources: string[];
  is_complete: boolean;
} 