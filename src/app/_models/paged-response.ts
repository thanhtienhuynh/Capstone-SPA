import { Response } from "./response";

export class PagedResponse<T> extends Response<T>
{
    pageNumber: number;
    pageSize: number;
    firstPage: number;
    lastPage: number;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;

    constructor(data: T, succeeded: boolean, errors: string[], message: string, pageNumber: number, pageSize: number, totalPages: number, 
      nextPage: number, previousPage: number)
    {
      super(data, succeeded, errors, message);
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
      this.data = data;
      this.message = null;
      this.succeeded = true;
      this.totalPages = totalPages;
      this.nextPage = nextPage;
      this.previousPage = previousPage;
      this.errors = null;
    }
}