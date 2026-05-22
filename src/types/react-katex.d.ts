declare module 'react-katex' {
  import { ComponentType, ReactNode } from 'react';

  interface KatexProps {
    children?: ReactNode;
    className?: string;
    math?: string;
    displayMode?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
    colorIsTextColor?: boolean;
    strict?: boolean | 'ignore' | 'warn' | 'error';
    trust?: boolean | ((context: { command: string; url: string; protocol: string }) => boolean);
  }

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
}
