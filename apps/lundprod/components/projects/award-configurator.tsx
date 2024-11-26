import { chunk } from 'lodash';
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
  Heading,
  Text,
  Tooltip,
  useBoolean,
} from '@chakra-ui/react';
import { AddIcon, StarIcon } from '@chakra-ui/icons';
import { useGetDefaultAwards } from '~/lundprod/hooks/use-get-default-awards';
import { useScreenshot } from '~/lundprod/hooks/use-screenshot';

export const AwardConfigurator = () => {
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLDivElement>(null);

  const [hasCanvas, setHasCanvas] = useBoolean(false);
  const screenshot = useScreenshot();
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
    for (const child of Array.from(canvasRef.current.children)) {
      canvasRef.current.removeChild(child);
    }

    for (var i = 0; i < 4; ++i) {
      const block = document.querySelector(`#award-block-${i}`);

      if (!block) {
        return;
      }

      const canvas = await screenshot(block as HTMLElement | null);

      if (canvas) {
        canvasRef.current.appendChild(canvas);
        setHasCanvas.on();
      }
    }
  };

  const fieldBlocks = chunk(fields, 5);

  return (
    <FormProvider {...form}>
      <Form>
        <Box>
          {fieldBlocks.map((fieldBlock, blockIndex) => (
            <Box id={`award-block-${blockIndex}`} bg="gray.800">
              {fieldBlock.map((field, index) => (
                <AwardRow
                  key={field.id}
                  field={field}
                  index={blockIndex * 5 + index}
                  onEditAward={() =>
                    setEditedAward({ field, index: blockIndex * 5 + index })
                  }
                  onDelete={remove}
                />
              ))}
              {blockIndex + 1 === fieldBlocks.length && (
                <Text transform="translateY(-25px)" textAlign="right" mr="10px">
                  {t('awards.copyright')}
                </Text>
              )}
            </Box>
          ))}
        </Box>

        <Flex alignItems="center" gap={4}>
          <Tooltip isDisabled={fields.length < 20} label={t('awards.maxAward')}>
            <Button
              colorScheme="orange"
              leftIcon={<AddIcon color="white" />}
              onClick={() => append({ label: 'Award', games: [] })}
              isDisabled={fields.length === 20}
            >
              {t('awards.addAward')}
            </Button>
          </Tooltip>
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
          <Flex
            flexWrap="wrap"
            gap={5}
            ref={canvasRef}
            p="8px"
            maxW="1000px"
            sx={{
              '& > img': {
                w: '200px',
                border: '1px solid white',
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
