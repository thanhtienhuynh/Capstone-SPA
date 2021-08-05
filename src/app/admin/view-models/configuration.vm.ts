export interface ConfigurationRM {
    crawlTime?: CrawlTime,
    updateRankTime?: UpdateRankTime,
    expireArticleTime?: ExpireArticleTime,
    testMonths: number
}

export interface CrawlTime {
    start?: number,
    minStart?: number,
    type?: number,    
}

export interface UpdateRankTime {
    start?: number,
    minStart?: number,
    type?: number,    
}

export interface ExpireArticleTime {
    start?: number,
    minStart?: number,
    type?: number,
}

export interface PagingConfiguration {
    firstPage: number, 
    highestQuantity: number
}

export interface LabelValue {
    label: string,
    value: number
}