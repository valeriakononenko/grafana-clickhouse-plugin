import { FieldConfig, FieldType } from '@grafana/data/types/dataFrame';
import { MutableField } from '@grafana/data/dataframe/MutableDataFrame';
import { ArrayVector, MutableVector } from '@grafana/data';

export const arrayVectorCreator = (buffer?: any[]) => {
  return new ArrayVector(buffer);
};

function toNumber(v: any): number {
  if (typeof v === 'number') {
    return v;
  } else if (v instanceof Date) {
    return v.getTime();
  } else {
    return Number.NaN;
  }
}

export class Field<T> implements MutableField<T> {
  config: FieldConfig;
  name: string;
  type: FieldType;
  values: MutableVector<T>;

  constructor(name: string, type: FieldType, displayName: string) {
    this.name = name;
    this.type = type;
    this.config = {
      min: Number.NaN,
      max: Number.NaN,
      displayName: displayName,
    };

    this.values = arrayVectorCreator([]);
  }

  add(v: any) {
    const num = toNumber(v);
    this.updateMax(num);
    this.updateMin(num);
    this.values.add(v);
  }

  private updateMax(v: number) {
    const max = this.config.max;

    if (max && !Number.isNaN(max) && !Number.isNaN(v) && max < v) {
      this.config.max = v;
    }
  }

  private updateMin(v: number) {
    const min = this.config.min;

    if (min && !Number.isNaN(min) && !Number.isNaN(v) && min > v) {
      this.config.min = v;
    }
  }
}
