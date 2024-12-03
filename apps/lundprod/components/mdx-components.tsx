import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Code as ChakraCode,
  Divider,
  Heading,
  HeadingProps,
  Image,
  ImageProps,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { NextRouter, useRouter } from 'next/router';
import { ReactNode } from 'react';

import * as helpers from './blog/blog-helpers';

export const StyledLink = styled(Link)`
  &:hover {
    color: var(--chakra-colors-orange-300);
  }
`;

const titleCommonProps: (
  children: ReactNode,
  push: NextRouter['push'],
) => HeadingProps = (children, push) => {
  if (typeof children !== 'string') {
    console.log('children is not a string :(');
    return {};
  }

  const id = children
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .replaceAll(' ', '-');
  const onClick = () => {
    push(`#${id}`, undefined, { shallow: true });
  };

  return {
    id,
    cursor: 'pointer',
    position: 'relative',
    onClick,
    w: 'fit-content',
    borderBottom: '1px solid transparent',
    _hover: {
      borderBottom: '1px solid var(--chakra-colors-blue-700)',
    },
    sx: {
      '&:before': {
        content: '"#"',
        position: 'absolute',
        left: '-30px',
        display: 'none',
      },
      '&:hover:before': {
        display: 'block',
        paddingRight: '10px',
      },
    },
  };
};

const BlockQuote = ({ children }: { children: ReactNode }) => (
  <Box
    as="blockquote"
    color="gray.300"
    bg="gray.600"
    borderLeft="2px solid var(--chakra-colors-gray-100)"
    p={3}
    sx={{ '& > p': { textIndent: '0px' } }}
  >
    {children}
  </Box>
);
const CdnImage = ({
  src,
  external = false,
  ...rest
}: ImageProps & { external?: boolean }) => (
  <Image
    src={external ? src : `${process.env.NEXT_PUBLIC_CDN_URL}${src}`}
    {...rest}
  />
);
const Code = ({ children }: { children: ReactNode }) => (
  <ChakraCode px={2} py={0} textIndent={0}>
    {children}
  </ChakraCode>
);
const Em = ({ children }: { children: ReactNode }) => (
  <Text as="em" fontStyle="italic">
    {children}
  </Text>
);
const H1 = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  return (
    <Heading {...titleCommonProps(children, push)} variant="h1" as="h1">
      {children}
    </Heading>
  );
};
const H2 = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  return (
    <Heading {...titleCommonProps(children, push)} variant="h2" as="h2">
      {children}
    </Heading>
  );
};
const H3 = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  return (
    <Heading {...titleCommonProps(children, push)} variant="h3" as="h3">
      {children}
    </Heading>
  );
};
const H4 = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  return (
    <Heading {...titleCommonProps(children, push)} variant="h4" as="h4">
      {children}
    </Heading>
  );
};
const H5 = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  return (
    <Heading {...titleCommonProps(children, push)} variant="h5" as="h5">
      {children}
    </Heading>
  );
};
const H6 = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  return (
    <Heading {...titleCommonProps(children, push)} variant="h6" as="h6">
      {children}
    </Heading>
  );
};
const MdxHr = () => <Divider my="25px" />;
const MdxLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <StyledLink href={href} target="_blank" rel="noreferrer noopener">
    {children}
    <ExternalLinkIcon ml="3px" verticalAlign="baseline" mb="-2px" />
  </StyledLink>
);
const Pre = ({ children }: { children: ReactNode }) => (
  <Box
    as="pre"
    whiteSpace="pre"
    fontFamily="monospace"
    sx={{ code: { bg: 'gray.300', p: 4 } }}
  >
    {children}
  </Box>
);
const Strong = ({ children }: { children: ReactNode }) => (
  <Text as="strong" fontWeight="bold">
    {children}
  </Text>
);
const MdxText = ({ children }: { children: ReactNode }) => (
  <Text textIndent="30px" my="15px" textAlign="justify">
    {children}
  </Text>
);
const MdxTable = ({ children }: { children: ReactNode }) => {
  return <Table>{children}</Table>;
};
const MdxTbody = ({ children }: { children: ReactNode }) => {
  return <Tbody>{children}</Tbody>;
};
const MdxThead = ({ children }: { children: ReactNode }) => {
  return <Thead>{children}</Thead>;
};
const MdxTh = ({ children }: { children: ReactNode }) => {
  return <Th color="orange.300">{children}</Th>;
};
const MdxTr = ({ children }: { children: ReactNode }) => {
  return <Tr>{children}</Tr>;
};
const MdxTd = ({ children }: { children: ReactNode }) => {
  return <Td>{children}</Td>;
};

// https://mdxjs.com/table-of-components/
export const components = {
  a: MdxLink,
  blockquote: BlockQuote,
  code: Code,
  em: Em,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: MdxHr,
  img: Image,
  li: ListItem,
  ol: OrderedList,
  p: MdxText,
  pre: Pre,
  strong: Strong,
  ul: UnorderedList,
  table: MdxTable,
  tbody: MdxTbody,
  thead: MdxThead,
  th: MdxTh,
  tr: MdxTr,
  td: MdxTd,
  CdnImage,
  ...helpers,
};
