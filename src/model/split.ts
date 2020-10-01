import { DataFrame } from '@grafana/data';
import { Frame } from './frame';
import { FrameAccessor } from './frame-accessor';

type FramesMap = { [key: string]: Frame };

const DefaultFields = {
  TIME: 'time',
  VALUE: 'value',
  LABEL: 'label',
};

function mapFrames(frame: FrameAccessor): FramesMap | null {
  const timeField = frame.getField(DefaultFields.TIME);
  const valueField = frame.getField(DefaultFields.VALUE);
  const labelField = frame.getField(DefaultFields.LABEL);

  if (timeField && valueField && labelField) {
    const frames: FramesMap = {};

    for (let i = 0; i < frame.length; i++) {
      const time = timeField?.values?.get(i);
      const value = valueField?.values?.get(i);
      const label = labelField?.values?.get(i);

      if (!frames[label]) {
        const newFrame = new Frame({
          fields: [],
          length: 0,
          refId: frame.refId,
          name: label,
        });

        newFrame.addField(DefaultFields.TIME, timeField.type, DefaultFields.TIME);
        newFrame.addField(DefaultFields.VALUE, valueField.type, label);
        frames[label] = newFrame;
      }

      const f = frames[label];
      f.add({
        [DefaultFields.TIME]: time,
        [DefaultFields.VALUE]: value,
      });
    }

    return frames;
  }

  return null;
}

export function split(frame: DataFrame): DataFrame[] {
  const framesMap = mapFrames(new FrameAccessor(frame));

  if (framesMap) {
    return Object.values(framesMap).map(f => f.toDataFrame());
  }

  return [frame];
}
