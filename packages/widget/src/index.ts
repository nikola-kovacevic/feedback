import { init, render } from './ui';
import type { InitOptions, RenderOptions } from './types';

const FeedbackWidget = {
  init(options: InitOptions) {
    init(options.apiKey, options.user);
  },
  render(options: RenderOptions) {
    render(options.apiKey, options.target, options.user);
  },
};

(window as any).FeedbackWidget = FeedbackWidget;
export default FeedbackWidget;
