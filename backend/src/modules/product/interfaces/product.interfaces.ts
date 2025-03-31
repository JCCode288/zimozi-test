export class AddProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: number[];
  images: Express.Multer.File[];
}

export type EditProductDTO = Partial<AddProductDTO> & { updated_at: Date };
