export class CollapseArticle {
  id: number;
  title: string;
  publishedPage: string;
  postedDate: Date;
  publicFromDate: Date;
  timeAgo: string;
  shortDescription: string;
  postImageUrl: string;
  status: number;
}

export class HomeArticle {
  type: number;
  articles: CollapseArticle[];
}