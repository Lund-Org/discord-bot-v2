import { TypeMap } from '~/lundprod/utils/backlog';

export type SearchFormValues = {
  query: string;
  type: TypeMap;
  platformId: string;
};
