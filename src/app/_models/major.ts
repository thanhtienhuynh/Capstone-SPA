import { DetailArticle } from "./detail-article";
import { CusUniversity } from "./university";

export interface Major {
  id: number;
  name: string;
  code: string;
  weightMark: number;
  highestEntryMark: number;
}

export interface CusMajor {
  id: number;
  name: string;
  code: string;
  curriculum: string;
  salaryDescription: string;
  humanQuality: string;
  description: string;
  numberOfUniversity: number;
}

export class CusMajorParam {
  name: string;
  code: string;
  order: number;
}

export interface CusSingleMajorDetail {
  id: number;
  name: string;
  code: string;
  description: string;
  curriculum: string;
  humanQuality: string;
  salaryDescription: string;
  universities: CusUniversity[];
  articles: DetailArticle[];
  careers: Career[];
  subjectGroups: SubjectGroupDetail[];
}

export interface Career {
  id: number;
  name: string;
  description: string;
}

export interface SubjectGroupDetail {
  id: number;
  name: string;
  subjects: string[];
}