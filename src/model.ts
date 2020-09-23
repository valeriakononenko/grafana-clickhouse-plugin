import {
  AnnotationEvent,
  AnnotationQueryRequest,
  DataFrame,
  DataQuery,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceJsonData,
  dateTime,
  isDataFrame,
  MetricFindValue,
  ScopedVars,
  TimeRange,
} from '@grafana/data';
import { DataQueryResponseData } from '@grafana/data/types/datasource';
import Mustache from 'mustache';
import { getTemplateSrv } from '@grafana/runtime';
import {FieldType} from "@grafana/data/types/dataFrame";

type TemplateVariables = { [key: string]: any };

type TemplateVariableOption = {
  selected: boolean;
  value: string | string[];
};

function isTemplateVariableOption(option: any): option is TemplateVariableOption {
  return (
    option &&
    typeof option['selected'] === 'boolean' &&
    option['value'] !== undefined &&
    (typeof option['value'] === 'string' || option['value'] instanceof Array)
  );
}

type TemplateVariableModel = {
  current: TemplateVariableOption;
  options: TemplateVariableOption[];
  multi?: boolean;
  name: string;
};

function isTemplateVariableModel(tvm: any): tvm is TemplateVariableModel {
  return (
    tvm &&
    isTemplateVariableOption(tvm['current']) &&
    tvm['options'] instanceof Array &&
    tvm['options'].every(isTemplateVariableOption) &&
    (tvm['multi'] === undefined || typeof tvm['multi'] === 'boolean')
  );
}

const ALL_VARIABLE = '$__all';

export interface ClickHouseQuery extends DataQuery {
  datasourceId: number;
  query: string;
  datasource: string;
  splitTs: boolean;
}

type ClickHouseSecureOptions = {
  password: string;
};

export interface ClickHouseOptions extends DataSourceJsonData {
  host: string;
  port: number;
  username: string;
  secureJsonData: ClickHouseSecureOptions;
}

export const Default = {
  QUERY: 'SELECT 1;',
};

export function buildAnnotationRequest(
  request: AnnotationQueryRequest<ClickHouseQuery>,
  datasourceId: number
): DataQueryRequest<ClickHouseQuery> {
  return {
    requestId: ['annotation', datasourceId, request.annotation.name].join('-'),
    targets: [
      {
        refId: request.annotation.refId || request.annotation.name,
        datasourceId: datasourceId,
        query: request.annotation.query,
        datasource: request.annotation.datasource,
      },
    ],
  } as DataQueryRequest<ClickHouseQuery>;
}

function buildAnnotationEvent(annotation: any, data: DataFrame, i: number): AnnotationEvent | null {
  const event = {
    annotation: annotation,
  } as AnnotationEvent;

  data.fields.forEach(field => {
    const fieldValue = field.values.get(i);

    if (fieldValue !== null && fieldValue !== undefined) {
      switch (field.name) {
        case 'time':
          event.time = typeof fieldValue === 'number' ? fieldValue : event.time;
          break;
        case 'title':
          event.title = typeof fieldValue === 'string' ? fieldValue : event.title;
          break;
        case 'text':
          event.text = typeof fieldValue === 'string' ? fieldValue : event.text;
          break;
        case 'tags':
          event.tags =
            typeof fieldValue === 'string'
              ? fieldValue
                  .replace('[', '')
                  .replace(']', '')
                  .split(',')
                  .map(v => v.trim())
              : event.tags;
          break;
      }
    }
  });

  if (!event.title) {
    event.title = annotation.name;
  }

  return event.time ? event : null;
}

export function buildAnnotationEvents(annotation: any, data: DataQueryResponseData): AnnotationEvent[] {
  const events: AnnotationEvent[] = [];

  if (isDataFrame(data)) {
    for (let i = 0; i < data.length; i++) {
      const event = buildAnnotationEvent(annotation, data, i);

      if (event && event.time) {
        events.push(event);
      }
    }
  }

  return events;
}

function getTemplateVariablesFromRequest(request: DataQueryRequest<ClickHouseQuery>): TemplateVariables {
  const result: TemplateVariables = {};
  const vars: TemplateVariables = {
    interval: request.interval,
    intervalMs: request.intervalMs,
    maxDataPoints: request.maxDataPoints,
    timezone: request.timezone,
    from: request.range.from.unix(),
    to: request.range.to.unix(),
  };
  const varKeys = Object.keys(vars);

  for (let j = 0; j < varKeys.length; j++) {
    const key = varKeys[j];
    const value = vars[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

function getTemplateVariablesFromScopedVars(scopedVars: ScopedVars): TemplateVariables {
  const result: TemplateVariables = {};
  const scopedKeys = Object.keys(scopedVars);

  for (let i = 0; i < scopedKeys.length; i++) {
    const key = scopedKeys[i];
    const scopedVar = scopedVars[key];
    if (scopedVar && scopedVar.value !== undefined) {
      result[key] = scopedVar.value;
    }
  }

  return result;
}

function getArrayVariable(tvm: TemplateVariableModel): string[] {
  const result: string[] = [];
  const isAll = tvm.current.value instanceof Array && tvm.current.value.length && tvm.current.value[0] === ALL_VARIABLE;

  for (let i = 0; i < tvm.options.length; i++) {
    const option = tvm.options[i];

    if (typeof option.value === 'string') {
      if (isAll && !option.selected) {
        result.push(option.value);
      } else if (!isAll && option.selected) {
        result.push(option.value);
      }
    }
  }

  return result;
}

function getTemplateVariablesFromTemplateSrv(): TemplateVariables {
  const result: TemplateVariables = {};
  const templateVars: any[] = getTemplateSrv().getVariables() || [];

  for (let k = 0; k < templateVars.length; k++) {
    const templateVar = templateVars[k] || {};

    if (isTemplateVariableModel(templateVar)) {
      if (templateVar.multi) {
        result[templateVar.name] = getArrayVariable(templateVar);
      } else {
        result[templateVar.name] = templateVar.current.value;
      }
    }
  }

  return result;
}

function addTemplateVariables(vars: TemplateVariables, otherVars: TemplateVariables): TemplateVariables {
  const keys = Object.keys(otherVars);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (vars[key] === undefined && otherVars[key] !== undefined) {
      vars[key] = otherVars[key];
    }
  }

  return vars;
}

function getTemplateVariables(request: DataQueryRequest<ClickHouseQuery>): TemplateVariables {
  const fromRequest = getTemplateVariablesFromRequest(request);
  const fromScopedVars = getTemplateVariablesFromScopedVars(request.scopedVars);
  const fromTemplateSrv = getTemplateVariablesFromTemplateSrv();

  return addTemplateVariables(addTemplateVariables(fromRequest, fromScopedVars), fromTemplateSrv);
}

export function buildDataRequest(request: DataQueryRequest<ClickHouseQuery>): DataQueryRequest<ClickHouseQuery> {
  const requestTargets: ClickHouseQuery[] = [];
  const targets = request.targets || [];

  for (let i = 0; i < targets.length; i++) {
    let target = targets[0];

    if (!target.hide && target.query) {
      target.query = Mustache.render(target.query, getTemplateVariables(request));
      requestTargets.push(target);
    }
  }

  request.targets = requestTargets;

  return request;
}

function makeTimeRange(from: number, to: number): TimeRange {
  return {
    from: dateTime(from),
    to: dateTime(to),
    raw: { from: `${from}`, to: `${to}` },
  };
}

function toLeadingZeroPositiveNumber(n: number): string {
  if (n < 10) {
    return '0' + n.toString();
  } else {
    return n.toString();
  }
}

function makeDateTimeString(time: Date): string {
  const y = time.getFullYear();
  const m = toLeadingZeroPositiveNumber(time.getMonth() + 1);
  const d = toLeadingZeroPositiveNumber(time.getDate());
  const h = toLeadingZeroPositiveNumber(time.getHours());
  const mm = toLeadingZeroPositiveNumber(time.getMinutes());
  const s = toLeadingZeroPositiveNumber(time.getSeconds());
  return `${y}-${m}-${d} ${h}:${mm}:${s}`;
}

export function buildMetricQueryRequest(query: string): DataQueryRequest<ClickHouseQuery> {
  return {
    app: '',
    dashboardId: 0,
    interval: '',
    panelId: 0,
    range: makeTimeRange(0, Date.now()),
    requestId: '',
    scopedVars: {} as ScopedVars,
    startTime: 0,
    targets: [
      {
        refId: '',
        datasourceId: 0,
        query: query,
        datasource: '',
        splitTs: false,
      },
    ],
    timezone: '',
  };
}

export function buildMetricFindValues(res: DataQueryResponse): MetricFindValue[] {
  const result: MetricFindValue[] = [];

  if (!res.error) {
    res.data.forEach(d => {
      if (isDataFrame(d)) {
        d.fields.forEach(f => {
          const values = f.values;

          for (let i = 0; i < d.length; i++) {
            const v = values.get(i);

            if (f.type === FieldType.time && (typeof v === 'number' || v instanceof Date)) {
              result.push({
                text: makeDateTimeString(new Date(v)),
              });
            } else {
              result.push({
                text: v.toString(),
              });
            }
          }
        });
      }
    });
  }

  return result;
}
