export interface Message {
    id: string;
    timestamp: Date;
    content: string | File[];
    type: 'text' | 'image';
}

export interface File {
    name: string;
    url: string;
}