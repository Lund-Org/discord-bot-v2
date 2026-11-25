import { AddIcon, StarIcon } from '@chakra-ui/icons';
import { Button, Flex, Text, Tooltip } from '@chakra-ui/react';
import { chunk } from 'lodash';
import { useMemo, useState } from 'react';
import {
  FieldArrayWithId,
  Form,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useScreenshot } from '~/lundprod/hooks/use-screenshot';
import { AwardForm } from '~/lundprod/types/awards';

import { AwardRow } from './award/award-row';
import { EditAwardModal } from './award/edit-award-modal';

type AwardConfiguratorProps = {
  defaultConfig: string[];
};

export const AwardConfigurator = ({
  defaultConfig,
}: AwardConfiguratorProps) => {
  const { t } = useTranslation();

  const screenshot = useScreenshot();
  const [editedAward, setEditedAward] = useState<{
    field: FieldArrayWithId<AwardForm, 'awards', 'id'>;
    index: number;
  } | null>(null);
  const defaultValues = useMemo<AwardForm>(() => {
    return {
      awards: defaultConfig.map((label) => ({
        label,
        games: [],
      })),
    };
  }, [defaultConfig]);

  const form = useForm<AwardForm>({
    defaultValues,
  });
  const { control } = form;
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'awards',
  });

  const screenshotAwards = async (all: boolean) => {
    const screen = async (selector: string) => {
      const block = document.querySelector(selector);

      if (!block) {
        return;
      }

      const image = await screenshot(block as HTMLElement | null);

      if (image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx?.drawImage(image, 0, 0);
        const converted = canvas.toDataURL('image/jpeg');

        const link = document.createElement('a');
        link.id = 'award';
        link.download = `award.jpg`;
        link.href = converted;
        link.click();
      }
    };

    if (all) {
      await screen(`#awards`);
    } else {
      for (let i = 0; i < 4; ++i) {
        await screen(`#award-block-${i}`);

        await new Promise((resolve) => setTimeout(resolve, 0.5));
      }
    }
  };

  const fieldBlocks = chunk(fields, 5);

  return (
    <FormProvider {...form}>
      <Form>
        <Flex id="awards" flexDir="column" gap="30px" bg="gray.800">
          {fieldBlocks.map((fieldBlock, blockIndex) => (
            <Flex
              id={`award-block-${blockIndex}`}
              bg="gray.800"
              key={blockIndex}
              flexDir="column"
              gap="30px"
            >
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
            </Flex>
          ))}
        </Flex>

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
            onClick={() => screenshotAwards(true)}
          >
            {t('awards.screenshotAll')}
          </Button>
          <Tooltip label={t('awards.screenshotTooltip')}>
            <Button
              colorScheme="teal"
              leftIcon={<StarIcon color="white" />}
              onClick={() => screenshotAwards(false)}
            >
              {t('awards.screenshotMultipleFiles')}
            </Button>
          </Tooltip>
        </Flex>

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
