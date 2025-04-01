export class Pagination {
  private page: number;
  private limit: number;
  private total_data: number;
  private total_page: number;
  private next_page: boolean | null = null;
  private prev_page: boolean | null = null;

  constructor(page: number, limit: number, total_data: number) {
    this.page = page;
    this.limit = limit;
    this.total_data = total_data;
    this.total_page = Math.ceil(total_data / limit);
    this.next_page = page < this.total_page;
    this.prev_page = page > 1 && page <= this.total_page;
  }
}
