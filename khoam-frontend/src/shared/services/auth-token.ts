import Cookies from 'js-cookie';

export enum EnumTokens {
  'TOKEN' = 'token'
}

export const getAccessToken = () => {
  const accessToken = Cookies.get(EnumTokens.TOKEN);

  return accessToken || null;
};

export const saveTokenStorage = (token: string) => {
  Cookies.set(EnumTokens.TOKEN, token, {
    expires: 30
  });
};

export const removeTokenFromStorage = () => {
  Cookies.remove(EnumTokens.TOKEN);
};
