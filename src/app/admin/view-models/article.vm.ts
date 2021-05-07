export interface ArticleVM {
    id?: string,
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
    totalRecords?: number;           
}