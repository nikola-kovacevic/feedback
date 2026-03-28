export interface WidgetConfig {
  mode: 'floating' | 'inline';
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: string;
}

export interface InitOptions {
  apiKey: string;
  user?: Record<string, unknown>;
}

export interface RenderOptions extends InitOptions {
  target: string;
}
