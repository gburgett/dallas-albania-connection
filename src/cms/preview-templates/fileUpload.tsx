import * as React from 'react';

export const FileUploadPreview = ({entry, getAsset}) => {
  if (!entry) {
    return <a><em>Cannot load file entry</em></a>
  }

  const dataUrl = entry.get(['data', 'url'])
  const linkText = entry.get(['data', 'text'])

  return <a href={getAsset(dataUrl) || ''} >{linkText}</a>
}