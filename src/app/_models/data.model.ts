export interface DataModel {
    sectiontitle: string;
    title: string;
    sectionsnippet: string;
    snippet: string;
    timestamp: Date;
}

export interface ApiResponse {
    query: {
      search: DataModel[];
    };
  }

  export interface DataState {
    data: DataModel[];
    filter: string;
    loading: boolean;
  }