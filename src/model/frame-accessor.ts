import { DataFrame, Field } from '@grafana/data';

export class FrameAccessor {
  refId?: string;
  name?: string;
  length: number;
  fields: Field[];

  constructor(frame: DataFrame) {
    this.fields = frame.fields;
    this.length = frame.length;
    this.refId = frame.refId;
    this.name = frame.name;
  }

  getField(name: string): Field | null {
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      if (field.name === name) {
        return field;
      }
    }

    return null;
  }
}
