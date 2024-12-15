'use client';

import { useEffect } from 'react';

export function BuyMeACoffee() {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'andrewmurphyio');
    script.setAttribute('data-description', 'Help me cover AI costs!');
    script.setAttribute('data-message', 'Help me cover AI costs!');
    script.setAttribute('data-color', '#CD4631');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;

    script.onload = function () {
      const event = new CustomEvent('DOMContentLoaded', {
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  };

  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
    const widget = document.getElementById('bmc-wbtn');
    if (widget) {
      document.body.removeChild(widget);
    }
  };
  }, []);

  return null;
}
