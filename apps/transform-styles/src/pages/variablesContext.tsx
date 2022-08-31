import * as React from 'react';

export interface VariablesContextOptions {
  allVariables: string[];
  selectedVariables: string[];
  setSelectedVariables: React.Dispatch<React.SetStateAction<string[]>>;
}

export const VariablesContext = React.createContext<VariablesContextOptions>({
  allVariables: [],
  selectedVariables: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedVariables: () => {},
});
