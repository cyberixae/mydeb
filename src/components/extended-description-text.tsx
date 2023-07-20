import React from 'react';

import { absurd } from '../lib/function';
import { ExtendedDescription, Item } from '../types/extended-description';

interface ExtendedDescriptionTextProps {
  readonly extendedDescription: ExtendedDescription;
}

export const ExtendedDescriptionText: React.FC<ExtendedDescriptionTextProps> = (
  props,
) => (
  <>
    {props.extendedDescription.map((elem: Item, i: number) => (
      <React.Fragment key={i}>
        {(() => {
          switch (elem._ED) {
            case 'blank':
              return <br />;
            case 'verbatim':
              return <pre style={{ margin: 0 }}>{elem.lines.join('\n')}</pre>;
            case 'paragraph':
              return <p style={{ margin: 0 }}>{elem.lines.join('\n')}</p>;
            default:
              return absurd(elem, 'absurd description element');
          }
        })()}
      </React.Fragment>
    ))}
  </>
);
