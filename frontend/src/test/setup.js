import '@testing-library/jest-dom';

// Polyfill browser globals for jsdom environment
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };

  // Polyfill ResizeObserver
  window.ResizeObserver = window.ResizeObserver || class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Polyfill IntersectionObserver for framer-motion / viewport checks
  window.IntersectionObserver = window.IntersectionObserver || class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}
