export enum RoutesMap {
  home = '',
  profile = 'profile',
  login = 'login',
  register = 'register'
}

export const routes = {
  home: '/',
  profile: `/${RoutesMap.profile}`,
  login: `/${RoutesMap.login}`,
  register: `/${RoutesMap.register}`
};
