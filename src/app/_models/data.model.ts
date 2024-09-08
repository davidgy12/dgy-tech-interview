export interface DataModel {
    title: string;
    snippet: string;
    timestamp: Date;
}

export interface ApiResponse {
    query: {
      search: DataModel[];
    };
  }