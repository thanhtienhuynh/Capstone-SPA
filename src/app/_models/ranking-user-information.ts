export interface RankingUserInformationGroupByTranscriptType {
  id: number;
  name: string;
  rankingUserInformations: RankingUserInformation[];
}

export interface RankingUserInformation {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  avatarUrl: string;
  groupCode: string;
  position: number;
  totalMark: number;
}