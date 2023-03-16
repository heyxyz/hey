declare module 'dayjs-twitter' {
  import type { PluginFunc } from 'dayjs';
  declare const plugin: PluginFunc;
  export default plugin;
  declare module 'dayjs' {
    interface Dayjs {
      twitter(): string;
    }
  }
}
