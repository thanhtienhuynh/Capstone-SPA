export interface ArticleVM {
    id?: string | number,
    title?: string,
    crawlerDate?: Date,
    importantLevel?: string,
    postImageUrl?: string,
    postedDate?: Date,
    publicFromDate?: Date,
    publicToDate?: Date,
    publishedPage?: string,
    shortDescription?: string,
    rootUrl?: string,
    content?: any,
    totalRecords?: number,
    universityArticles?: any[],
    status?: number,
    universityIds?: number[],
    majorIds?: number[]
}

export interface ArticleCM { 
    Title?: string, 
    ShortDescription?: string, 
    Content?: string, 
    PostImage?: File, 
    UniversityIds?: number[], 
    MajorIds?: number[] 
}