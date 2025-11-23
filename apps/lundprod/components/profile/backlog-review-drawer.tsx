import {
  AddIcon,
  ExternalLinkIcon,
  MinusIcon,
  StarIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  ListIcon,
  ListItem,
  Text,
  List,
  Show,
  Link,
  Badge,
} from '@chakra-ui/react';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { backlogItemSchema } from '~/lundprod/server/common-schema';
import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';

type BacklogGame = z.infer<typeof backlogItemSchema>;

type BacklogReviewDrawerProps = {
  item: BacklogGame | null;
  closeReview: () => void;
  userName: string;
};

export const BacklogReviewDrawer = ({
  item,
  closeReview,
  userName,
}: BacklogReviewDrawerProps) => {
  const { t } = useTranslation();
  const { push, query } = useRouter();

  const onReviewClose = () => {
    const { igdbGameId, ...params } = query;
    push({ query: params }, undefined, {
      shallow: true,
    });
    closeReview();
  };

  return (
    <Drawer isOpen={!!item} onClose={onReviewClose} placement="right" size="lg">
      <DrawerOverlay />
      {!!item && (
        <DrawerContent bg="gray.100">
          <DrawerCloseButton />
          <DrawerHeader display="flex" gap={2} alignItems="center">
            {t('userPage.review.title', {
              userName: capitalize(userName),
              gameName: item.name,
            })}
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon
                cursor="pointer"
                color="gray.600"
                _hover={{
                  color: 'gray.900',
                }}
              />
            </Link>
          </DrawerHeader>
          <DrawerBody>
            <Box>
              <Heading variant="h3" color="gray.800">
                {t('userPage.review.generalInformation')}
              </Heading>
              <Flex
                borderRadius={12}
                bg="gray.600"
                border="1px solid"
                borderColor="gray.800"
                p="20px"
                color="gray.200"
                flexDir="column"
                gap={2}
              >
                <Badge
                  variant="solid"
                  colorScheme={getBacklogStatusColor(item.status)}
                  px={3}
                  py={1}
                  w="fit-content"
                >
                  {getBacklogStatusTranslation(t, item.status)}
                </Badge>
                {item.backlogItemReview && (
                  <Flex gap={2} alignItems="center">
                    <Text>{t('userPage.review.rating')}</Text>
                    <Box whiteSpace="nowrap">
                      {Array.from(
                        { length: item.backlogItemReview.rating },
                        (_, index) => (
                          <StarIcon
                            key={index}
                            color="gold"
                            verticalAlign="middle"
                          />
                        ),
                      )}
                      {Array.from(
                        { length: 5 - item.backlogItemReview.rating },
                        (_, index) => (
                          <StarIcon
                            key={index}
                            color="gray.300"
                            verticalAlign="middle"
                          />
                        ),
                      )}
                    </Box>
                  </Flex>
                )}
                {item.backlogItemReview?.completion && (
                  <Box>
                    <Text>
                      {t('userPage.review.completion', {
                        completion: item.backlogItemReview.completion,
                      })}
                    </Text>
                    {item.backlogItemReview.completionComment && (
                      <Text fontStyle="italic" fontSize="14px">
                        {item.backlogItemReview.completionComment}
                      </Text>
                    )}
                  </Box>
                )}
                {item.backlogItemReview?.duration && (
                  <Text>
                    {t('userPage.review.duration', {
                      duration: item.backlogItemReview.duration,
                    })}
                  </Text>
                )}
              </Flex>
              <Heading variant="h3" color="gray.800" mt={10}>
                {t('userPage.review.review')}
              </Heading>
              <Text whiteSpace="break-spaces">
                {item.backlogItemReview?.review}
              </Text>
              <Flex
                display={{ base: 'block', md: 'flex' }}
                gap={5}
                alignItems="stretch"
                mt={10}
                color="gray.800"
              >
                <Box w={{ base: '100%', md: '47%' }}>
                  <Heading variant="h6" color="inherit" mb={2}>
                    {t('userPage.review.pros')}
                  </Heading>
                  <List spacing={2}>
                    {(item.backlogItemReview?.pros || []).map(
                      ({ value: pro }, index) => (
                        <ListItem key={index}>
                          <ListIcon
                            as={AddIcon}
                            color="green.500"
                            verticalAlign="baseline"
                          />
                          {pro}
                        </ListItem>
                      ),
                    )}
                  </List>
                </Box>
                <Show above="md">
                  <Box flex={1}>
                    <Divider
                      orientation="vertical"
                      mx="auto"
                      w="2px"
                      borderColor="gray.700"
                    />
                  </Box>
                </Show>
                <Box w={{ base: '100%', md: '47%' }} mt={{ base: 10, md: 0 }}>
                  <Heading variant="h6" color="inherit" mb={2}>
                    {t('userPage.review.cons')}
                  </Heading>
                  <List spacing={2}>
                    {(item.backlogItemReview?.cons || []).map(
                      ({ value: con }, index) => (
                        <ListItem key={index}>
                          <ListIcon
                            as={MinusIcon}
                            color="red.500"
                            verticalAlign="baseline"
                          />
                          {con}
                        </ListItem>
                      ),
                    )}
                  </List>
                </Box>
              </Flex>
            </Box>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  );
};
