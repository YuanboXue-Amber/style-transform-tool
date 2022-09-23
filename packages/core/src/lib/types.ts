export type Variables = Record<string, boolean>;

/**
 * parameters from user input, used during computing styles
 */
export type UserInputs = {
  /**
   * if the styles file under evaulation is namespaced (button-namespace-chatList.ts) or not (button-styles.ts)
   */
  isNamespaced: boolean;

  /**
   * chosen variables.
   * NOTE: for namespaced styles, currently only support one variable
   */
  variables?: Variables;

  /**
   * For namespaced styles file: variableProps associated with the specified variable
   */
  variableProps?: Record<string, any>;

  /**
   * For non-namespaced styles file: componentProps associated with the specified variable
   */
  componentProps?: Record<string, any>;
};

export type ComputeStyles = (inputs: UserInputs) => string | null | undefined;

export type Main = ({
  inputFilename,
  exportName,
  isTransformAllThemes,
  preparedSiteVariables,
}: {
  /**
   * path to styles file
   */
  inputFilename: string;

  /**
   * exported function from styles file. It's normally `default` for namespaced styles file.
   */
  exportName: string;

  /**
   * Specify true will compute styles from styles files with the same filename in other themes folder.
   * Otherwise styles will only be computed from the current specified `inputFilename` file
   */
  isTransformAllThemes: boolean;

  /**
   * Computing styles requires siteVariables from theme.
   * When programatically computing styles repeatly, pass in prepare siteVariables to prevent recomputing it
   */
  preparedSiteVariables?: PreparedSiteVariables;
}) => ComputeStyles;

export type ComputeStylesFromFile = ({
  gitRoot,
  inputFilename,
  exportName,
}: {
  inputFilename: string;
  exportName: string;
  gitRoot: string;
  preparedSiteVariables?: PreparedSiteVariables;
}) => (inputs: UserInputs) => Record<string, any>;

export type ThemeName =
  | "teams"
  | "teams-v2"
  | "teams-tfl"
  | "teams-dark"
  | "teams-dark-v2"
  | "teams-dark-tfl"
  | "teams-high-contrast";

export type PreparedSiteVariables = Partial<Record<ThemeName, any>>;
export type ComputeOneTheme = ({
  preparedSiteVariables,
  gitRoot,
  themeName,
  currentThemeStylesFile,
  exportName,
}: {
  themeName: ThemeName;
  currentThemeStylesFile: string;
  exportName: string;
  preparedSiteVariables?: PreparedSiteVariables;
  gitRoot?: string;
}) => (inputs: UserInputs) => (result: Record<string, any>) => void;
