'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <div>Loading Swagger UI...</div>,
}) as any;

class SwaggerUIWrapper extends React.Component<{ url: string }> {
  componentDidMount() {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('UNSAFE_componentWillReceiveProps')) {
        return;
      }
      originalWarn.apply(console, args);
    };
  }

  render() {
    return <SwaggerUI {...this.props} />;
  }
}

export default function DocsPage() {
  return (
    <div>
      <SwaggerUIWrapper url="/api/docs" />
    </div>
  );
}
