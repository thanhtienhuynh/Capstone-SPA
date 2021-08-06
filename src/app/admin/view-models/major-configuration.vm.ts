export interface MajorConfiguration {
    id?: number,
    name?: string,
    code?: string,
    description?: string,
    curriculum?: string,
    humanQuality?: string,
    salaryDescription?: string,
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

export interface SubjectGroupFe {
  id?: GroupCodeFe,
  status?: number,
  subjectWeights?: SubjectWeightFe[]
}

export interface SubjectWeightFe {
  subjectId?: SubectIdFe,
  weight?: number,
  isSpecialSubjectGroup?: boolean
}

export interface SubectIdFe {
  subjectId?: number,
  subjectName?: string
}

export interface GroupCodeFe {
  id?: number,
  groupCode?: string
}
