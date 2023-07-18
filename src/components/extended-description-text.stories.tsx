
import type { Meta, StoryObj } from '@storybook/react';

import { examplesExtendedDescription } from '../types/extended-description';
import { ExtendedDescriptionText } from './extended-description-text';

const [exampleExtendedDescription] = examplesExtendedDescription;

const meta = {
  title: 'Components/ExtendedDescription/Text',
  component: ExtendedDescriptionText,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ExtendedDescriptionText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    extendedDescription: exampleExtendedDescription,
  },
};
