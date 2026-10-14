import React from 'react';

type ProviderProps = {
  children: React.ReactNode;
};

type ProviderComponent = React.ComponentType<ProviderProps>;

export const composeProviders = (providers: ProviderComponent[]) => {
  return ({ children }: ProviderProps) =>
    providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);
};
