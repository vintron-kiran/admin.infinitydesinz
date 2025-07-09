export interface CreateProductDto {
  id?: number;
  sku: string;
  title: string;
  description?: string;
  brandId: number;
  mainCategoryId?: number;
  subCategoryId?: number;
  listSubCategoryId?: number;
  status: boolean;
  stock: number;
  sizeId?: number;
  colorId?: number;
  mrp: number;
  sellingPrice: number;
  height?: number;
  width?: number;
  length?: number;
  searchKeywords?: string;

  productDetails?: {
    model: string;
    weight?: number;
    sla?: number;
    deliveryCharges?: number;
  };

  variants?: {
    sku: string;
    stock: number;
    mrp: number;
    sellingPrice: number;
    sizeId?: number;
    colorId?: number;
  }[];
}

export interface ProductFeatureDto {
  model?: string;
  color?: string;
  idealFor?: string;
  usage?: string;
  assemblyRequired?: boolean;
  withCushions?: boolean;
  otherFeatures?: string;
}

export interface ProductFilterDto {
  fabric?: string;
  design?: string;
  occasion?: string;
  type?: string;
}

export interface ExistingFeature {
  featureId: number;
  value: string;
}

export interface ProductFeatureDto {
  productId: number;
  featureId: number;
  value: string;
}

export interface ProductFeatureUpdateDto {
  productId: number;
  featureId: number;
  value: string;
}

export interface ProductDetailsDto {
  productId?: number;
  model?: string;
  type?: string;
  brand?: string;
  ideal_for?: string;
  assembly_required?: string;
  with_cushions?: string;
  usage?: string;
  color?: string;
  other_features?: string;
  dimensions?: string;
  weight?: string;
}
