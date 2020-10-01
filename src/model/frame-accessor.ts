import { DataFrame, Field } from '@grafana/data';
import { Frame } from './frame';

type FramesMap = { [key: string]: Frame };

const SplitFields = {
  TIME: 'time',
  VALUE: 'value',
  LABEL: 'label',
};

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

  splitByLabel(): Frame[] {
    if (this.timeField && this.valueField && this.labelField) {
      const fm: FramesMap = {};

      for (let i = 0; i < this.length; i++) {
        const time = this.timeField.values?.get(i);
        const value = this.valueField.values?.get(i);
        const label = this.labelField.values?.get(i);

        if (!fm[label]) {
          const newFrame = new Frame({
            fields: [],
            length: 0,
            refId: this.refId,
            name: label,
          });

          newFrame.addField(SplitFields.TIME, this.timeField.type, SplitFields.TIME);
          newFrame.addField(SplitFields.VALUE, this.valueField.type, label);
          fm[label] = newFrame;
        }

        const f = fm[label];
        f.add({
          [SplitFields.TIME]: time,
          [SplitFields.VALUE]: value,
        });
      }

      return Object.values(fm);
    }

    return [];
  }

  splitByTime(): Frame[] {
    if (this.timeField) {
      const fm: FramesMap = {};

      for (let i = 0; i < this.length; i++) {
        const time = this.timeField.values?.get(i);

        for (let j = 0; j < this.fields.length; j++) {
          const field = this.fields[j];
          const name = field.name;

          if (!fm[name]) {
            const newFrame = new Frame({
              fields: [],
              length: 0,
              refId: this.refId,
              name: name,
            });

            newFrame.addField(SplitFields.TIME, this.timeField.type, SplitFields.TIME);
            newFrame.addField(SplitFields.VALUE, field.type, name);
            fm[name] = newFrame;
          }

          const f = fm[name];
          f.add({
            [SplitFields.TIME]: time,
            [SplitFields.VALUE]: field.values.get(i),
          });
        }
      }

      return Object.values(fm);
    }

    return [];
  }

  split(): DataFrame[] {
    const byLabel = this.splitByLabel();

    if (byLabel.length > 0) {
      return byLabel;
    } else {
      const byTime = this.splitByTime();

      if (byTime.length > 0) {
        return byTime;
      }
    }

    return [this.frame];
  }
}
