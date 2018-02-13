// Your module must at least include these three imports
import * as React from "react";
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

import {FooterPreview} from './preview-templates/footer'
import {BlogPreview} from './preview-templates/blog'

// Let's say you've created widget and preview components for a custom image
// gallery widget in separate files
//import ImageGalleryWidget from "./image-gallery-widget.js";
//import ImageGalleryPreview from "./image-gallery-preview.js";

CMS.registerPreviewStyle('/styles.css');
CMS.registerPreviewTemplate('footer', FooterPreview);
CMS.registerPreviewTemplate('blog', BlogPreview);

// Register the imported widget:
//CMS.registerWidget("image-gallery", ImageGalleryWidget, ImageGalleryPreview);