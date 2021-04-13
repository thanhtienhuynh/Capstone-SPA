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