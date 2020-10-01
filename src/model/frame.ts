import { DataFrame, FieldType, MISSING_VALUE, MutableDataFrame, Field as DataField } from '@grafana/data';
import { Field } from './field';
import { FrameAccessor } from './frame-accessor';

type Values = { [key: string]: any };

export class Frame {
  private readonly accessor: FrameAccessor;
  private readonly fields: Array<Field<Values>>;
  length: number;

  constructor(frame: DataFrame) {
    this.accessor = new FrameAccessor(frame);
    this.fields = [];
    this.length = 0;
  }

  getField(name: string): DataField<any> | null {
    return this.accessor.getField(name);
  }

  addField(name: string, type: FieldType, displayName: string): Field<Values> {
    const field = new Field<Values>(name, type, displayName);
    this.fields.push(field);
    return field;
  }

  add(value: Values): void {
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      const v = value[field.name];

      if (v === undefined) {
        field.add(MISSING_VALUE);
      } else {
        field.add(v);
      }
    }

    this.length += 1;
  }

  toDataFrame(): DataFrame {
    return new MutableDataFrame({
      fields: this.fields,
      length: this.length,
      meta: undefined,
      name: this.accessor.name,
      refId: this.accessor.refId,
    });
  }
}
