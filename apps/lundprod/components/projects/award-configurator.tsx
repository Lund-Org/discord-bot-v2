import { useMemo, useRef, useState } from 'react';
import {
  FieldArrayWithId,
  Form,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AwardRow } from './award/award-row';
import { AwardForm } from '~/lundprod/types/awards';
import { EditAwardModal } from './award/edit-award-modal';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { AddIcon, StarIcon } from '@chakra-ui/icons';
import { useGetDefaultAwards } from '~/lundprod/hooks/use-get-default-awards';
import { useScreenshot } from '~/lundprod/hooks/use-screenshot';

const SCREENSHOT_SELECTOR = 'award-configurator';

export const AwardConfigurator = () => {
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLDivElement>(null);

  const [hasCanvas, setHasCanvas] = useBoolean(false);
  const screenshot = useScreenshot(`#${SCREENSHOT_SELECTOR}`);
  const [editedAward, setEditedAward] = useState<{
    field: FieldArrayWithId<AwardForm, 'awards', 'id'>;
    index: number;
  } | null>(null);
  const defaultCategories = useGetDefaultAwards();
  const defaultValues = useMemo<AwardForm>(() => {
    return {
      awards: defaultCategories.map((label) => ({
        label,
        games: [],
      })),
    };
  }, [defaultCategories]);

  const form = useForm<AwardForm>({
    defaultValues,
  });
  const { control } = form;
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'awards',
  });

  const screenshotAwards = async () => {
    if (canvasRef.current) {
      const canvas = await screenshot();

      if (canvas) {
        for (const child of Array.from(canvasRef.current.children)) {
          canvasRef.current.removeChild(child);
        }

        canvasRef.current.appendChild(canvas);
        setHasCanvas.on();
      }
    }
  };

  return (
    <FormProvider {...form}>
      <Form>
        <Box id={SCREENSHOT_SELECTOR} bg="gray.800">
          {fields.map((field, index) => (
            <AwardRow
              key={field.id}
              field={field}
              index={index}
              onEditAward={() => setEditedAward({ field, index })}
              onDelete={remove}
            />
          ))}
          <Text transform="translateY(-25px)" textAlign="right" mr="10px">
            {t('awards.copyright')}
          </Text>
        </Box>

        <Flex alignItems="center" gap={4}>
          <Button
            colorScheme="orange"
            leftIcon={<AddIcon color="white" />}
            onClick={() => append({ label: 'Award', games: [] })}
          >
            {t('awards.addAward')}
          </Button>
          <Button
            colorScheme="teal"
            leftIcon={<StarIcon color="white" />}
            onClick={screenshotAwards}
          >
            {t('awards.screenshot')}
          </Button>
        </Flex>

        <Box pt="25px" w="fit-content" mx="auto" textAlign="center">
          {hasCanvas && (
            <>
              <Heading variant="h5">{t('awards.canvas')}</Heading>
              <Text mb="10px">{t('awards.canvasHint')}</Text>
            </>
          )}
          <Box
            ref={canvasRef}
            border={hasCanvas && '2px solid white'}
            maxW="500px"
            sx={{
              '& > canvas': {
                width: '100% !important',
                height: '100% !important',
              },
            }}
          />
        </Box>

        {!!editedAward && (
          <EditAwardModal
            field={editedAward.field}
            onEdit={(newField) => update(editedAward.index, newField)}
            onClose={() => setEditedAward(null)}
          />
        )}
      </Form>
    </FormProvider>
  );
};
