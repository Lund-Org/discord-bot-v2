import { Box, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { ProjectLine } from '~/lundprod/components/projects/project-line';

import projects from '../../utils/data/projects.json';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {},
  };
};

export function ProjectListPage() {
  return (
    <Box py="30px">
      <Heading px="50px" variant="h3" mb="20px">
        Projets
      </Heading>
      <Text px="50px" mb="20px">
        Des passions j&apos;en ai des tas, et des projets tout autant. Si
        j&apos;ai envie de faire un truc, j&apos;apprends ce qu&apos;il me faut.
        Ainsi par exemple, j&apos;ai appris à faire de la 3D pour pouvoir me
        débrouiller seul à faire des assets graphiques, à défaut d&apos;avoir la
        dextérité ou les connaissances pour du dessin.
      </Text>
      <Text px="50px" mb="30px">
        Ainsi, vous trouverez ici une liste de tous mes projets :
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
