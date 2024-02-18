import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { getRandomPal, isRightPal } from '@discord-bot-v2/common/lib/pal-guess';
import { useRef, useState } from 'react';

type GuessThePalFormProps = {
  cdnUrl: string;
};

export const GuessThePalForm = ({ cdnUrl }: GuessThePalFormProps) => {
  const [pal, setPal] = useState(() => getRandomPal());
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useBoolean(false);
  const [isPassed, setIsPassed] = useBoolean(false);
  const ref = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    const { notFound, valid, wrong } = isRightPal(ref.current.value, pal.id);

    ref.current.value = '';
    if (wrong) {
      setError('Mauvais Pal !');
    } else if (notFound) {
      setError("Ce Pal n'existe pas");
    } else if (valid) {
      setIsSuccess.on();
    }
  };

  const pass = () => {
    setError(`C'était ${pal.name}`);
    setIsPassed.on();
  };

  const isFinished = isSuccess || isPassed;

  return (
    <Box mt="40px" maxW="400px" mx="auto">
      <Image
        mx="auto"
        maxW="300px"
        maxH="300px"
        w="100%"
        backgroundColor="gray.300"
        src={`${cdnUrl}/projects/guess-the-pal/${
          isFinished ? 'color' : 'black'
        }/${pal.id}.png`}
      />
      <Flex gap="10px" mt="10px" display={isFinished ? 'none' : 'flex'}>
        <Input
          ref={ref}
          onChange={() => setError(null)}
          onKeyDown={(event) => {
            if (event.code === 'Enter') {
              onSubmit();
            }
          }}
          variant="outline"
          placeholder="Nom du Pal"
          flex={1}
        />
        <IconButton
          colorScheme="orange"
          icon={<ArrowForwardIcon />}
          aria-label="Soumettre"
          onClick={onSubmit}
        />
        <Button colorScheme="red" aria-label="Passer" onClick={pass}>
          Passer
        </Button>
      </Flex>
      {!!error && <Text color="red">{error}</Text>}
      {isSuccess && (
        <Box textAlign="center" mt="10px">
          <Button
            colorScheme="green"
            onClick={() => {
              setPal(getRandomPal());
              setIsSuccess.off();
            }}
          >
            Pal suivant
          </Button>
        </Box>
      )}
      {isPassed && (
        <Box textAlign="center" mt="10px">
          <Button
            colorScheme="orange"
            onClick={() => {
              setPal(getRandomPal());
              setIsPassed.off();
              setError(null);
            }}
          >
            Pal suivant
          </Button>
        </Box>
      )}
    </Box>
  );
};
