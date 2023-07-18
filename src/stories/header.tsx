import React from 'react';

interface HeaderProps {
  readonly Link: React.FC<{ children: React.ReactNode }>
}

export const Header = (props: HeaderProps) => (
  <h1 style={{textAlign: 'center', marginBottom: '0'}}>
    <props.Link>MyDeb</props.Link>
  </h1>
);
