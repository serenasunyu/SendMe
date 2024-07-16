import { Message, File } from '../types/types';

const fakeFiles: File[] = [
  { name: 'demo-Saul.jpg', url: 'https://media.istockphoto.com/id/1939608350/photo/happy-mature-latin-man-using-laptop-at-home-technology-and-smart-working-concept.jpg?s=1024x1024&w=is&k=20&c=IPtj3EqZe7lDtJu1APOknmDTEJ09GPPxQkaIH9wExlQ=' },
  { name: 'demo-White.png', url: 'https://media.istockphoto.com/id/1629818920/photo/abstract-gravity-wave-background.jpg?s=1024x1024&w=is&k=20&c=iEXr_b_LUumn1Ns2nIoSg6zT7Qr2v62ubWnanW9lDjc=' },
  { name: 'demo-image-1.jpg', url: 'https://media.istockphoto.com/id/1657879053/photo/big-data-and-network-digital-transformation-concept.jpg?s=1024x1024&w=is&k=20&c=8ymXZhCI9jv0aB_ifvngsZpL9Ue4RPg8V8OskKu8Ty4=' },
];

export const fakeMessages: Message[] = [
  {
    id: '1',
    timestamp: new Date('2024-04-13T00:30:00'),
    content: 'Hello, this is another text message',
    type: 'text',
  },
  {
    id: '2',
    timestamp: new Date('2024-04-11T20:09:23'),
    content: [fakeFiles[0], fakeFiles[1]],
    type: 'image',
  },
  {
    id: '3',
    timestamp: new Date('2024-04-11T16:40:45'),
    content: 'Hello, this is a text message',
    type: 'text',
  },
  {
    id: '4',
    timestamp: new Date('2024-04-11T16:40:45'),
    content: [fakeFiles[2]],
    type: 'image',
  },
];