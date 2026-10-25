// by claude
// docmd plugin: "Ask in" Claude, ChatGPT and Perplexity pills for the docmd AI widget (see client.js).
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const plugin = {
  name: 'ask-ai',
  version: '1.0.0',
  capabilities: ['assets'],
};

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));

export function getAssets() {
  return [
    { src: path.join(PLUGIN_DIR, 'client.js'), dest: 'assets/js/ask-ai.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'client.css'), dest: 'assets/css/ask-ai.css', type: 'css', location: 'head' },
  ];
}
