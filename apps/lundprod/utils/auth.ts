export const getErrorMessage = (error: string) => {
  switch (error) {
    case 'AccessDenied':
      return "Impossible de vous connecter.\nVous n'avez pas de comptes ou un problème s'est produit à la connexion.";
    case 'Verification':
      return 'Impossible de vérifier le token, ou il a expiré.';
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
      return "Il y a un problème avec le paramétrage de l'application pour l'authentification.\nContactez le responsable.";
    default: // = case 'Default':
      return "Une erreur inconnue s'est produite.\nPeut-être n'avez vous pas de compte ?";
  }
};
