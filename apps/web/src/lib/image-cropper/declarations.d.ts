declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'normalize-wheel' {
  const normalizeWheel: (event: WheelEvent) => {
    spinX: number;
    spinY: number;
    pixelX: number;
    pixelY: number;
  };
  export default normalizeWheel;
}
