import { TFunction } from 'i18next';

export const getErrorMessage = (tFn: TFunction, error: string) => {
  switch (error) {
    case 'AccessDenied':
      return tFn('auth.errorMessage.accessDenied');
    case 'Verification':
      return tFn('auth.errorMessage.verification');
    case 'Configuration':
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
    case 'OAuthAccountNotLinked':
    case 'EmailSignin':
    case 'CredentialsSignin':
    case 'SessionRequired':
      return tFn('auth.errorMessage.sessionRequired');
    default: // = case 'Default':
      return tFn('auth.errorMessage.unknown');
  }
};
