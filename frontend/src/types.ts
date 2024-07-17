export interface File {
    name: string;
    url: string;
  }
  
  export interface Message {
    id: string;
    type: 'text' | 'file';
    content: string;
    timestamp: string;
    files: File[];
  }