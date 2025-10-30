import { Box, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { ProjectLine } from '~/lundprod/components/projects/project-line';

import { getProjects } from '../../utils/data/projects';
import { useTranslation } from 'react-i18next';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {},
  };
};

export function ProjectListPage() {
  const { t } = useTranslation();
  const projects = getProjects(t);

  return (
    <Box pt="30px">
      <Heading px="50px" variant="h3" mb="20px">
        {t('projects.overview.title')}
      </Heading>
      <Text px="50px" mb="20px">
        {t('projects.overview.intro')}
      </Text>
      <Text px="50px" mb="30px">
        {t('projects.overview.listText')}
      </Text>
      {projects.map((data, index) => (
        <ProjectLine
          key={index}
          mode={index % 2 === 0 ? 'light' : 'dark'}
          label={data.title}
          description={data.description}
          to={data.to}
          bgImg={data.bgImg}
          newTab={data.newTab}
          date={data.date}
        />
      ))}
    </Box>
  );
}

export default ProjectListPage;
