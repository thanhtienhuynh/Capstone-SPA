import { SubjectGroupRM } from "./subject_group.vm";

export interface MajorRM {
    id?: number,
    name: string,
    code: string,
    numberOfStudent?: number,
    status?: unknown,
    subjectGroups?: SubjectGroupRM[]
}