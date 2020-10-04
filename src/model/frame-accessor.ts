import { DataFrame, Field, FieldType } from '@grafana/data';
import { Frame } from './frame';

const SplitFields = {
  TIME: 'time',
  VALUE: 'value',
  LABEL: 'label',
};

class FramesMap {
  private readonly frames: { [key: string]: Frame };
  private readonly refId: string;
  private readonly timeField: Field | null;

  constructor(refId: string, timeField: Field | null) {
    this.frames = {};
    this.refId = refId;
    this.timeField = timeField;
  }

  private setFrame(label: string, valueType: FieldType) {
    const newFrame = new Frame({
      fields: [],
      length: 0,
      refId: this.refId,
      name: label,
    });

    if (this.timeField) {
      newFrame.addField(SplitFields.TIME, this.timeField.type, SplitFields.TIME);
    }

    newFrame.addField(SplitFields.VALUE, valueType, label);
    this.frames[label] = newFrame;
  }

  addValue(label: string, valueField: Field | null, idx: number) {
    if (this.timeField && valueField) {
      const time = this.timeField.values?.get(idx);
      const value = valueField.values?.get(idx);

      if (!this.frames[label]) {
        this.setFrame(label, valueField.type);
      }

      const f = this.frames[label];
      f.add({
        [SplitFields.TIME]: time,
        [SplitFields.VALUE]: value,
      });
    }
  }

  getFrames(): Frame[] {
    return Object.values(this.frames);
  }
}

export class FrameAccessor {
  refId: string;
  name?: string;
  length: number;
  fields: Field[];

  private readonly frame: DataFrame;
  private readonly timeField: Field | null;
  private readonly valueField: Field | null;
  private readonly labelField: Field | null;

  constructor(frame: DataFrame) {
    this.frame = frame;

    this.fields = frame.fields;
    this.length = frame.length;
    this.name = frame.name;
    this.refId = this.getRefId();

    this.timeField = this.getField(SplitFields.TIME);
    this.valueField = this.getField(SplitFields.VALUE);
    this.labelField = this.getField(SplitFields.LABEL);
  }

  private getRefId(): string {
    return this.frame.refId || this.frame.name || this.frame.fields.map(f => f.name).join();
  }

  private getField(name: string): Field | null {
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      if (field.name === name) {
        return field;
      }
    }

    return null;
  }

  splitByLabel(): Frame[] | null {
    if (this.timeField && this.valueField && this.labelField) {
      const fm: FramesMap = new FramesMap(this.refId, this.timeField);

      for (let i = 0; i < this.length; i++) {
        const label = this.labelField.values?.get(i);

        if (label !== SplitFields.TIME) {
          fm.addValue(label, this.valueField, i);
        }
      }

      return fm.getFrames();
    }

    return null;
  }

  splitByValues(): DataFrame[] | null {
    if (this.timeField) {
      const fm: FramesMap = new FramesMap(this.refId, this.timeField);
      const fields = this.fields.filter(f => f.name !== SplitFields.TIME);

      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < fields.length; j++) {
          const field = fields[j];
          fm.addValue(field.name, field, i);
        }
      }

      return fm.getFrames();
    }

    return null;
  }
}
