
/// <reference types="vite/client" />
/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// This extends the expect interface to properly recognize jest-dom matchers
interface JestMatchers<R> {
  toBeInTheDocument(): R;
  toHaveTextContent(text: string): R;
}

declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string): R;
  }
}
