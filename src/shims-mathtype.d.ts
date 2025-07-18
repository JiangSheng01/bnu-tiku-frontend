declare module '@wiris/mathtype-generic/wirisplugin-generic' {
  export {};
}

declare global {
  interface GenericIntegrationProperties {
    target: HTMLElement;
    toolbar?: HTMLElement | null;
    integrationParameters?: {
      editorParameters?: {
        language?: string;
        fontFamily?: string;
        fontSize?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface GenericIntegration {
    init(): void;
    listeners: {
      fire(event: string, data?: any): void;
    };
    modalDialog?: {
      close(): void;
    };
  }

  interface WirisPlugin {
    GenericIntegration: new (properties: GenericIntegrationProperties) => GenericIntegration;
    Parser: {
      initParse: (html: string) => string;
      endParse: (html: string) => string;
    };
    currentInstance?: GenericIntegration;
  }

  interface Window {
    WirisPlugin?: WirisPlugin;
    wrs_int_init?: (target: HTMLElement, toolbar?: HTMLElement, config?: any) => any;
  }
}
