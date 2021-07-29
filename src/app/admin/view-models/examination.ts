export interface TestBySubject {
    id?: number,
    name?: string, 
    level?: unknown,
    numberOfQuestion?: number,
    year?: number,
    subjectId?: number,
    subjectName?: number,
    testTypeId?: number,
    testTypeName?: string, 
    timeLimit?: number,
    isSuggestedTest: boolean
}

export interface TestDetail {
    id?: number,
    name?: string,
    level?: number,
    numberOfQuestion?: number,
    year?: number,
    createDate?: Date,
    subjectId?: number,
    testTypeId?: number,
    universityId?: number,
    timeLimit?: 0,
    isSuggestedTest?: boolean;
    questions?: TestQuestion[]
}

export interface TestQuestion {
    id?: number,
    content?: string,
    numberOfOption?: number,
    result?: string,
    type?: number,
    testId?: number,
    isAnnotate?: boolean,
    realOrder?: number,
    options?: TestQuestionOption[]
}

export interface TestQuestionOption {
    id?: number,
    content?: string,
    questionId?: number,
    ordinal?: number,
    isResult?: boolean
}