import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Collapse, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useState } from 'react';

const usePolymorphicEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const Summary = () => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(true);
  const [summaryTitles, setSummaryTitles] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  usePolymorphicEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(
        '#blog-container h1, #blog-container h2, #blog-container h3, #blog-container h4, #blog-container h5, #blog-container h6'
      )
    );

    setSummaryTitles(
      headings.map((heading) => ({
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.nodeName.substring(1), 10),
      }))
    );
  }, []);

  if (!summaryTitles.length) {
    return null;
  }

  return (
    <Box
      borderLeft="2px solid var(--chakra-colors-blue-300)"
      my="15px"
      overflow="hidden"
    >
      <Button
        color="orange.400"
        variant="link"
        onClick={() => setIsCollapseOpen((v) => !v)}
        size="lg"
        pl="10px"
        _active={{ color: 'orange.500' }}
      >
        <Text>Sommaire</Text>
        <ChevronDownIcon
          {...(isCollapseOpen && { transform: 'rotate(180deg)' })}
          transition="transform .3s ease"
          mt="5px"
        />
      </Button>
      <Collapse in={isCollapseOpen} animateOpacity>
        <Box p="5px" color="white" pl="10px" maxW="800px">
          {summaryTitles.map(({ id, text, level }, index) => (
            <Link key={`${id}-${index}`} href={`#${id}`}>
              <Text
                pl={level * 4}
                py="5px"
                _hover={{ textDecoration: 'underline', bg: 'blue.900' }}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {text}
              </Text>
            </Link>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
