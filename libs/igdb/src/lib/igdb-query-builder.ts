import { IGDBConditionValue } from '../types';
import { QUERY_OPERATOR } from './constants';

export class IGDBQueryBuilder {
  private fields: string[];
  private query: string;
  private search: string;
  private sort: string;
  private limit: number;
  private offset: number;

  constructor() {
    this.reset();
  }

  reset() {
    this.query = '';
    this.sort = '';
    this.fields = [];
    this.limit = 10;
    this.offset = 0;
    return this;
  }

  and(fn: (queryBuilder: IGDBQueryBuilder) => IGDBQueryBuilder) {
    const temporaryQueryBuilder = new IGDBQueryBuilder();

    this.query += ` & ${fn(temporaryQueryBuilder).getQuery()}`;
    return this;
  }

  or(fn: (queryBuilder: IGDBQueryBuilder) => IGDBQueryBuilder) {
    const temporaryQueryBuilder = new IGDBQueryBuilder();

    this.query += ` | ${fn(temporaryQueryBuilder).getQuery()}`;
    return this;
  }

  getQuery() {
    return this.query;
  }

  toString() {
    let str = '';

    str += this.fields.length
      ? `fields ${this.fields.join(',')};`
      : 'fields *;';

    if (this.query) {
      str += `where ${this.query};`;
    }

    if (this.search) {
      str += `search "${this.search}";`;
    }
    if (this.sort) {
      str += `sort ${this.sort};`;
    }

    str += `limit ${this.limit};`;
    str += `offset ${this.offset};`;

    return str;
  }

  setFields(fields: string[]) {
    this.fields = fields;
    return this;
  }

  setSearch(search: string) {
    this.search = search.replaceAll('"', '');
    return this;
  }

  addField(field: string) {
    this.fields.push(field);
    return this;
  }

  setLimit(value: number) {
    if (value > 0) {
      this.limit = value;
    }
    return this;
  }

  setOffset(value: number) {
    if (value > 0) {
      this.offset = value;
    }
    return this;
  }

  where(field: string, operator: QUERY_OPERATOR, value: IGDBConditionValue) {
    let conditionValue = '';

    if (Array.isArray(value) && typeof value[0] === 'string') {
      conditionValue = `("${value.join('","')}")`;
    } else if (Array.isArray(value) && typeof value[0] === 'number') {
      conditionValue = `(${value.join(',')})`;
    } else if (typeof value === 'string') {
      conditionValue = `"${value}"`;
    } else {
      conditionValue = String(value);
    }

    this.query += `${field} ${String(operator)} ${
      operator === QUERY_OPERATOR.MATCH ? `*${conditionValue}*` : conditionValue
    }`;
    return this;
  }

  andWhere(field: string, operator: QUERY_OPERATOR, value: IGDBConditionValue) {
    this.and((subQueryBuilder) =>
      subQueryBuilder.where(field, operator, value)
    );
    return this;
  }

  orWhere(field: string, operator: QUERY_OPERATOR, value: IGDBConditionValue) {
    this.or((subQueryBuilder) => subQueryBuilder.where(field, operator, value));
    return this;
  }

  sortBy(field: string, order: 'asc' | 'desc') {
    this.sort = `${field} ${order}`;
    return this;
  }
}
