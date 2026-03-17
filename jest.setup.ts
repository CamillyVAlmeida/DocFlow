import "@testing-library/jest-dom";

// JSDOM não implementa matchMedia por padrão.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Clipboard API pode ser readonly em JSDOM; definimos uma implementação mock.
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: jest.fn(),
  },
});

