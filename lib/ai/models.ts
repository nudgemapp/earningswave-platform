// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "claude-3-sonnet-20240229",
    label: "Claude 3.5 Sonnet",
    apiIdentifier: "claude-3-sonnet-20240229",
    description: "Most accurate model",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
