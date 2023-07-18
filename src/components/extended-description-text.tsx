import React from 'react';

import { ExtendedDescription, Item } from '../types/extended-description';
import { absurd } from '../lib/function';

interface ExtendedDescriptionTextProps {
  readonly extendedDescription: ExtendedDescription
}

export const ExtendedDescriptionText: React.FC<ExtendedDescriptionTextProps> = (props) => (
       <>
        {props.extendedDescription.map((elem: Item, i: number) => (
          <React.Fragment key={i}>
            {(() => {
              if (elem._ED === 'blank') {
                return <br />;
              }
              if (elem._ED === 'verbatim') {
                return <pre style={{ margin: 0 }}>{elem.lines.join('\n')}</pre>;
              }
              if (elem._ED === 'paragraph') {
                return <p style={{ margin: 0 }}>{elem.lines.join('\n')}</p>;
              }
              return absurd(elem, 'absurd description element');
            })()}
          </React.Fragment>
        ))}
   </>
);
