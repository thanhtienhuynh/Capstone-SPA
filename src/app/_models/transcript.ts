export interface TranscriptType {
  id: number;
  name: string;
  priority: number;
  transcriptDetails: Transcript[];
}

export interface Transcript {
  transcriptId: number;
  mark: number;
  subjectId: number;
  subjectName: string;
  dateRecord: Date;
}