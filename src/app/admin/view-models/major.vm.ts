import { SubjectGroupRM } from "./subject_group.vm";

export interface MajorRM {
    id?: number,
    name?: string,
    code?: string,
    trainingProgramId?: number,
    trainingProgramName?: string,
    numberOfStudents?: number,
    status?: unknown,
    subjectGroups?: SubjectGroupRM[]
}

export interface MajorUniversity {
    universityId?: number | string,
    majorCode?: string,
    majorId?: number | string,
    majorName?: string,
    majorDetailUnies: MajorDetailUniversity[]
}

export interface MajorDetailUniversity {
    id?: number | string,
    trainingProgramId?: number | string,
    trainingProgramName?: string,
    majorDetailCode?: string,
    admissionQuantity?:number,
    seasonId?: number,
    seasonName?: string,
    majorDetailSubAdmissions?: MajorDetailSubAdmission[]
}

export interface MajorDetailSubAdmission {
    id: number,
    admissionMethodId?: number | string,
    admissionMethodName?: string,
    genderId: number,
    provinceId: number, 
    provinceName: string, 
    quantity: number,
    majorDetailEntryMarks?: MajorDetailEntryMark[]
}

export interface MajorDetailEntryMark {
    id?: number,
    mark?: number,
    majorSubjectGoupId?: number,
    subjectGroupCode?: string,
    subjectGroupId?: string
}

export interface Province {
    id?: number,
    name?: string,
    regionId?: number
}

export interface MajorSubjectGroup {
    id?: number,
    subjectGroupName?: string
}

export interface subjectGroupTmp {
    entryMarkId?: number,
    mark?: number,
    majorSubjectGroupId?: number,
    status?: number
}