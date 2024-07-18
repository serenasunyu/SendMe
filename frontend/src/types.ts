export interface File {
    id: string;
    name: string;
    url: string;
  }
  
  export interface Message {
    id: string;
    type: string;
    content: string;
    timestamp: string;
    files: File[];
  }