import React from 'react';

/**
 * Определяет, соответствует ли ширина окна планшетному брейкпоинту (`width < 1024px`).
 * Обновляется при изменении размера окна через `matchMedia`.
 *
 * @example
 * const isTablet = useIsTablet();
 *
 * @returns `true`, если ширина viewport меньше 1024px
 */
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = React.useState(false);

  React.useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(width < 1024px)');

    const handleChange = () => {
      setIsTablet(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isTablet;
};
