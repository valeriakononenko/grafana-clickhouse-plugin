import { DataFrame, FieldType, MISSING_VALUE, MutableDataFrame } from '@grafana/data';
import { Field } from './field';

type Values = { [key: string]: any };

export class Frame implements DataFrame {
  readonly fields: Array<Field<Values>>;
  refId?: string;
  name?: string;
  length: number;

  constructor(frame: DataFrame) {
    this.refId = frame.refId;
    this.name = frame.name;
    this.fields = [];
    this.length = 0;
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
      name: this.name,
      refId: this.refId,
    });
  }
}
