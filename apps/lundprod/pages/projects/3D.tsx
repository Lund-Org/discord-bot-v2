import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { Fragment } from 'react';

import { Gallery } from '~/lundprod/components/blog/blog-helpers';
import { LightStyledLink } from '~/lundprod/components/styled-link';

import { getGallery } from '../../utils/data/3D-gallery';
import { Trans, useTranslation } from 'react-i18next';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {
      cdnUrl: process.env.CDN_URL,
    },
  };
};

export function Project3D({ cdnUrl }: { cdnUrl: string }) {
  const { t } = useTranslation();
  const gallery = getGallery(t);

  return (
    <>
      <Box pt="30px" px="50px">
        <Heading variant="h3" mb="20px">
          {t('projects.3d.title')}
        </Heading>
        <Text>
          <Trans
            i18nKey="projects.3d.description"
            components={{
              lightLink: (
                <LightStyledLink
                  href="https://www.gamedev.tv/"
                  target="_blank"
                />
              ),
            }}
          />
        </Text>
      </Box>
      <Box maxW="1200px" mx="auto" textAlign="center">
        {gallery.map(({ title, description, images }) => (
          <Fragment key={title}>
            <Box my="50px" mx="auto" w="800px">
              <Heading variant="h4">{title}</Heading>
              <Box w="fit-content" bg="gray.900" maxW="650px" mx="auto">
                <Gallery
                  images={images.map((img) => ({
                    ...img,
                    src: `${cdnUrl}${img.src}`,
                  }))}
                  aspectRatio={null}
                />
              </Box>
              <Text pt="10px" fontStyle="italic">
                {description}
              </Text>
            </Box>
            <Divider />
          </Fragment>
        ))}
      </Box>
    </>
  );
}

export default Project3D;
