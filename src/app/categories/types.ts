export interface Category {
  id?: number;
  title: string;
  parent_id?: number | null;
  position?: number;
  status?: boolean;
  frontDisplay?: string;
  appIcon?: string;
  webImage?: string;
  mainImage?: string;
  filterTypeId?: number;
  featureTypeIds?: number[];
    featureTypes?: FeatureType[];
  categoryFeatures?: CategoryFeature[];
}
export interface Feature {
  id: number;
  name: string;
}

export interface FeatureType {
  id: number;
  name: string;
}

export interface CategoryFeature {
  id: number;
  categoryId: number;
  featureId: number;
  feature: Feature;
}
