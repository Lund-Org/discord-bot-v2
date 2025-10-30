import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

type Toast = {
  title: string;
  description?: string;
};

export const useErrorToast = () => {
  const toast = useToast();

  return useCallback(({ title, description }: Toast) => {
    toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, []);
};
export const useSuccessToast = () => {
  const toast = useToast();

  return useCallback(({ title, description }: Toast) => {
    toast({
      title,
      description,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }, []);
};
