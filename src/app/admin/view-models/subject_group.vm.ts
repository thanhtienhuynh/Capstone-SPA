import { EntryMark } from "./entry_mark.vm";

export interface SubjectGroupRM {
    id?: number,
    groupCode?: string,    
    status?: number,
    entryMarks?: EntryMark[]
}