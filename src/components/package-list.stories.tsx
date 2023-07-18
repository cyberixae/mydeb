import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PackageList } from './package-list';

const meta = {
  title: 'Components/Package/List',
  component: PackageList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PackageList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    packages: ['test123', 'test789', 'test456'],
    PackageLink: ({ children }) => <a href="#">{children}</a>,
  },
};

export const Empty: Story = {
  args: {
    packages: [],
    PackageLink: ({ children }) => <a href="#">{children}</a>,
  },
};
