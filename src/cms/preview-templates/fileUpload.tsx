import * as React from 'react';

export const FileUploadPreview = ({entry, getAsset}) => {
  const dataUrl = entry.get(['data', 'url'])
  const linkText = entry.get(['data', 'text'])

  return <a href={getAsset(dataUrl) || ''} >{linkText}</a>
}