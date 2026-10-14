import React from 'react';

/**
 * Определяет, соответствует ли ширина окна мобильному брейкпоинту (`width < 640px`).
 * Обновляется при изменении размера окна через `matchMedia`.
 *
 * @example
 * const isMobile = useIsMobile();
 *
 * @returns `true`, если ширина viewport меньше 640px
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(width < 640px)');

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
};
