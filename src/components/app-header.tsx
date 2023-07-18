import React from 'react';

interface HeaderProps {
  readonly FrontPageLink: React.FC<{ children: React.ReactNode }>;
}

export const Header = (props: HeaderProps) => (
  <h1 style={{ textAlign: 'center', marginBottom: '0' }}>
    <props.FrontPageLink>MyDeb</props.FrontPageLink>
  </h1>
);
