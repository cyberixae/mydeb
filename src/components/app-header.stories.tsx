import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './app-header';

const meta = {
  title: 'Components/App/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    FrontPageLink: ({ children }) => <a href="#">{children}</a>,
  },
};
