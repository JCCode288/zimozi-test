enum PaginationLimit {
   LOW = 5,
   MEDIUM = 10,
   HIGH = 15,
}

export interface PaginationResponse {
   page: number;
   limit: PaginationLimit;
   total_data: number;
   total_page: number;
   next_page: boolean;
   prev_page: boolean;
}

export interface ApiResponse<T> {
   status: number;
   message: string;
   data: T;
   pagination?: PaginationResponse;
}
