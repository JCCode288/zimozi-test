export class AddCategoryDTO {
  name: string;
}

export type EditCategoryDTO = Partial<AddCategoryDTO>;
