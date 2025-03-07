export interface ValidationConfigDto {
  propertyName: string;
  value: any;
  type: any;
  isOptional: boolean;
  comparisonFromDateProperty?: string;
  comparisonFromDatePropertyValue?: string;
}
