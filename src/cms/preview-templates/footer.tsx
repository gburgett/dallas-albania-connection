
import * as React from 'react';
//import { AboutPageTemplate } from '../../templates/about-page';

export const FooterPreview = (props) => {
  return <pre>
      {JSON.stringify(props, null, 2)}
    </pre>
};