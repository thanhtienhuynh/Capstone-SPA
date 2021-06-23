export interface MajorConfiguration {
    id?: number,
    name?: string,
    code?: string,
    subjectGroups?: SubjetGroup[],
    status?: number  
}

export interface SingleMajorConfiguration {
    id?: number,
    name?: string,
    code?: string,
    subjectGroups?: SubjetGroup,
    status?: number  
}

export interface SubjetGroup {
    id?: number,
    groupCode?: string,
    subjectWeights?: SubjectWeight[],
    status?: number
}

export interface SubjectWeight{
    id?: number,
    name?: string,
    weight?: number,
    isSpecialSubjectGroup?: boolean
    status?: number
}