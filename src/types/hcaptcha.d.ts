declare module '@hcaptcha/react-hcaptcha' {
  import { Component } from 'react';

  interface HCaptchaProps {
    sitekey: string;
    size?: 'compact' | 'normal';
    theme?: 'light' | 'dark';
    tabIndex?: number;
    languageOverride?: string;
    onVerify?: (token: string, ekey: string) => void;
    onExpire?: () => void;
    onError?: (error: string) => void;
    onLoad?: () => void;
    onClick?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
  }

  export default class HCaptcha extends Component<HCaptchaProps> {
    resetCaptcha(): void;
  }
}