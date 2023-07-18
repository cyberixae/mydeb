import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { examplesDependencies } from '../types/dependencies';
import { DependenciesList } from './dependencies-list';

const [exampleDependencies] = examplesDependencies;

const meta = {
  title: 'Components/Dependencies/List',
  component: DependenciesList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DependenciesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    dependencies: exampleDependencies,
    availability: {
      test123: true,
      test789: true,
    },
    PackageLink: ({ children }) => <a href="#">{children}</a>,
  },
};

export const Empty: Story = {
  args: {
    dependencies: [],
    availability: {},
    PackageLink: ({ children }) => <a href="#">{children}</a>,
  },
};
