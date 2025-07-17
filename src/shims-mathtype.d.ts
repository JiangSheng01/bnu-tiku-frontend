declare module '@wiris/mathtype-generic/wirisplugin-generic' {
  interface WirisPlugin {
    GenericIntegration: new (properties: any) => any;
    Parser: {
      initParse: (html: string) => string;
      endParse: (html: string) => string;
    };
    currentInstance: any;
  }

  interface Window {
    WirisPlugin: WirisPlugin;
    wrs_int_init: (target: HTMLElement, toolbar?: HTMLElement, config?: any) => any;
  }

  export {};
}

declare global {
  interface Window {
    WirisPlugin: any;
    wrs_int_init: (target: HTMLElement, toolbar?: HTMLElement, config?: any) => any;
  }
}
