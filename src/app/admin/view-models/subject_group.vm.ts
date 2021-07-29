import { EntryMark } from "./entry_mark.vm";
import { Subject } from "./subject.vm";

export interface SubjectGroupRM {
    id?: number,
    groupCode?: string, 
    name?: string,       
    status?: number,
    isDeleted?: boolean,
    entryMarks?: EntryMark[]
}

export interface SubjectGroupVM {
    id?: number,
    groupCode?: string
}

export interface SubjectPerSubjectGroup {
    id?: number,
    groupCode?: string,
    subjects?: Subject[]
}