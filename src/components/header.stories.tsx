import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './header';

const meta = {
  title: 'Molecules/Header',
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
    Link: ({ children }) => (<a href="#">{children}</a>),
  },
};
