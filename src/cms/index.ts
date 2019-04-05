// Your module must at least include these three imports
import * as React from "react";
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

import {FooterPreview} from './preview-templates/footer'
import {ArticlePreview} from './preview-templates/article'
import {PagePreview} from './preview-templates/page'
import {BlogPreview} from './preview-templates/blog'
import { HomepagePreview } from "./preview-templates/homepage"

import { FileUploadPreview } from './preview-templates/fileUpload'

// Let's say you've created widget and preview components for a custom image
// gallery widget in separate files
//import ImageGalleryWidget from "./image-gallery-widget.js";
//import ImageGalleryPreview from "./image-gallery-preview.js";

CMS.registerPreviewStyle('/styles.css');
CMS.registerPreviewTemplate('footer', FooterPreview);
CMS.registerPreviewTemplate('articles', ArticlePreview);
CMS.registerPreviewTemplate('pages', PagePreview);
CMS.registerPreviewTemplate('blog', BlogPreview);
CMS.registerPreviewTemplate('homepage', HomepagePreview);


// Register the imported widget:
//CMS.registerWidget("image-gallery", ImageGalleryWidget, ImageGalleryPreview);

CMS.registerEditorComponent({
  label: 'File',
  id: 'file',
  fromBlock: match => match && {
    url: match[2],
    text: match[1],
  },
  toBlock: data => `[${ data.text || '' }](${ data.url || '' })`,
  toPreview: FileUploadPreview,
  pattern: /^\[(.*)\]\((\/.*\.(?:pdf|csv|doc|docx))\)$/,
  fields: [{
    label: 'File',
    name: 'url',
    widget: 'file',
  }, {
    label: 'Link text',
    name: 'text',
  }]
})