import { DataQueryRequest } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import Mustache from 'mustache';
import { Default } from './model';

type TemplateVariables = { [key: string]: any };

type TemplateVariableOption = {
  selected: boolean;
  value: string | string[];
};

type TemplateVariableModel = {
  current: TemplateVariableOption;
  options: TemplateVariableOption[];
  multi?: boolean;
  name: string;
};

function isTemplateVariableOption(option: any): option is TemplateVariableOption {
  return (
    option &&
    typeof option['selected'] === 'boolean' &&
    option['value'] !== undefined &&
    (typeof option['value'] === 'string' || option['value'] instanceof Array)
  );
}

function isTemplateVariableModel(tvm: any): tvm is TemplateVariableModel {
  return (
    tvm &&
    isTemplateVariableOption(tvm['current']) &&
    tvm['options'] instanceof Array &&
    tvm['options'].every(isTemplateVariableOption) &&
    (tvm['multi'] === undefined || typeof tvm['multi'] === 'boolean')
  );
}

function getTimeZone(tz: string): string {
  return tz === Default.BROWSER_TIMEZONE
    ? Default.TIMEZONE_OFFSET + (new Date().getTimezoneOffset() / 60).toString()
    : tz;
}

function getTemplateVariablesFromRequest(request: DataQueryRequest): TemplateVariables {
  const result: TemplateVariables = {};
  const vars: TemplateVariables = {
    interval: request.interval,
    intervalMs: request.intervalMs,
    maxDataPoints: request.maxDataPoints,
    timezone: getTimeZone(request.timezone),
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

function getArrayVariable(tvm: TemplateVariableModel): string[] {
  const result: string[] = [];
  const isAll =
    tvm.current.value instanceof Array && tvm.current.value.length && tvm.current.value[0] === Default.ALL_VARIABLE;

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

export function getTemplateVariables(request: DataQueryRequest): TemplateVariables {
  return addTemplateVariables(getTemplateVariablesFromRequest(request), getTemplateVariablesFromTemplateSrv());
}

export function renderQuery(query: string, request: DataQueryRequest): string {
  return Mustache.render(query, getTemplateVariables(request));
}

export function preloadQuery(query: string, request: DataQueryRequest | undefined): string {
  try {
    if (request !== undefined) {
      return renderQuery(query, request);
    }
  } catch (e) {
    console.error('Unable to load query: ', e);
  }

  return query;
}
