import {
  Tab,
  TabList,
  TabListProps,
  TabProps,
  Tabs,
  TabsProps,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

import { getParam } from '../utils/next';

type QueryTabsProps<T extends string> = {
  queryName: string;
  values: T[];
  tabs: Record<T, string>;
  tabsProps?: Omit<TabsProps, 'children'>;
  tabListProps?: Omit<TabListProps, 'children'>;
  tabProps?: TabProps | ((value: T, isSelected: boolean) => TabProps);
  children: ReactNode;
  defaultValue: T;
  customProcessOnTabChange?: (url: URL) => URL;
};

export const QueryTabs = <T extends string>({
  queryName,
  tabs,
  values,
  tabProps,
  tabListProps,
  tabsProps,
  children,
  defaultValue,
  customProcessOnTabChange,
}: QueryTabsProps<T>) => {
  const { query, replace } = useRouter();
  const param = !query[queryName] ? defaultValue : getParam(query[queryName]);
  const [queryParam, setQueryParam] = useState(param);

  useEffect(() => {
    if (!values.includes(param as T)) {
      setQueryParam(defaultValue);
    }

    if (param !== queryParam) {
      const url = new URL(document.location.href);

      url.searchParams.set(queryName, queryParam);

      replace(customProcessOnTabChange ? customProcessOnTabChange(url) : url);
    }
  }, [param, queryParam]);

  const tabIndex = values.findIndex((val) => val === queryParam);

  return (
    <Tabs
      index={tabIndex}
      onChange={(index) => setQueryParam(values[index])}
      {...(tabsProps || {})}
    >
      <TabList {...(tabListProps || {})}>
        {values.map((val, index) => (
          <Tab
            key={val}
            {...(typeof tabProps === 'function'
              ? tabProps(val, tabIndex === index)
              : tabProps || {})}
          >
            {tabs[val]}
          </Tab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
};
