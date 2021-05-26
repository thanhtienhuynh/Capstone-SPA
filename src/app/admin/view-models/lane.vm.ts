import { ArticleVM } from "./article.vm";

export interface Lane {
    id?: string,
    title?:string,
    articles?: ArticleVM[]
}