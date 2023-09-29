import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  Flex,
  FlexProps,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

const GalleryButtonStyle: FlexProps = {
  position: 'absolute',
  top: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  color: 'white',
  bg: 'rgba(0, 0, 0, 0.65)',
  cursor: 'pointer',
  _hover: {
    bg: 'rgba(0, 0, 0, 0.30)',
  },
  transform: 'translateY(-50%)',
};

type ImageItem = {
  src: string;
  description: string;
};

type GalleryProps = {
  images: ImageItem[];
  aspectRatio?: number | null;
};

export const Gallery = ({ images, aspectRatio = 16 / 9 }: GalleryProps) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [fullscreenImg, setFullscreenImg] = useState<ImageItem | null>(null);

  if (!images.length) {
    return null;
  }

  const previousSlide = () => {
    if (animating || step === 0) {
      return;
    }

    setStep(getPrevious(step, images.length));
    setAnimating(true);

    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  };
  const nextSlide = () => {
    if (animating || step === images.length) {
      return;
    }

    setStep(getNext(step, images.length));
    setAnimating(true);

    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  };
  const selectImg = (index: number) => {
    console.log(step, index);
    console.log(typeof step, typeof index);
    if (index === step) {
      console.log(images[step]);
      setFullscreenImg(images[step]);
    }
  };

  return (
    <>
      <RatioWrapper aspectRatio={aspectRatio}>
        <Flex w="100%" position="relative" overflow="hidden">
          <Flex
            {...GalleryButtonStyle}
            left={0}
            onClick={previousSlide}
            borderRadius="0 8px 8px 0"
            {...(step === 0 && { cursor: 'not-allowed' })}
          >
            <ChevronLeftIcon boxSize="30px" />
          </Flex>
          <Flex
            {...GalleryButtonStyle}
            right={0}
            onClick={nextSlide}
            borderRadius="8px 0 0 8px"
            {...(step === images.length - 1 && { cursor: 'not-allowed' })}
          >
            <ChevronRightIcon boxSize="30px" />
          </Flex>
          {images[step].description && (
            <Box
              position="absolute"
              left="0px"
              h="40px"
              right="0px"
              bottom={0}
              bg="rgba(0, 0, 0, 0.75)"
              lineHeight="40px"
              textAlign="center"
              textOverflow="ellipsis"
              zIndex={2}
              overflow="hidden"
              whiteSpace="nowrap"
              px="10px"
            >
              {images[step].description}
            </Box>
          )}
          <Flex>
            {images.map((image, index) => (
              <Box
                w="100%"
                flexShrink={0}
                key={index}
                {...(index === 0 && {
                  ml: `${step * -100}%`,
                  transition: 'margin-left 1s ease',
                })}
                cursor="pointer"
                onClick={() =>
                  image.src.endsWith('mp4') ? undefined : selectImg(index)
                }
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {image.src.endsWith('mp4') ? (
                  <video controls width="100%">
                    <source src={image.src} type="video/mp4" />
                  </video>
                ) : (
                  <Image src={image.src} alt={image.description} />
                )}
              </Box>
            ))}
          </Flex>
        </Flex>
      </RatioWrapper>
      <Modal
        size="6xl"
        isOpen={!!fullscreenImg}
        onClose={() => setFullscreenImg(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prévisualisation</ModalHeader>
          <ModalCloseButton />
          {fullscreenImg && (
            <ModalBody>
              <Box textAlign="center">
                <Image
                  display="inline-block"
                  src={fullscreenImg.src}
                  alt={fullscreenImg.description}
                />
              </Box>
              <Box textAlign="center" py="10px" fontWeight="bold">
                {fullscreenImg.description}
              </Box>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

function getPrevious(current: number, size: number) {
  return current - 1 < 0 ? size - 1 : current - 1;
}

function getNext(current: number, size: number) {
  return current + 1 === size ? 0 : current + 1;
}

const RatioWrapper = ({
  children,
  aspectRatio,
}: {
  children: ReactNode;
  aspectRatio: number | null;
}) => {
  return aspectRatio ? (
    <AspectRatio maxW="800px" ratio={aspectRatio} mx="auto">
      {children}
    </AspectRatio>
  ) : (
    <Box w="fit-content">{children}</Box>
  );
};
