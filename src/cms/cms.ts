// Your module must at least include these three imports
import * as React from "react";
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

import {FooterPreview} from './preview-templates/footer'
import {ArticlePreview} from './preview-templates/article'
import { AboutPreview } from "./preview-templates/about";
import { HomepagePreview } from "./preview-templates/homepage";

// Let's say you've created widget and preview components for a custom image
// gallery widget in separate files
//import ImageGalleryWidget from "./image-gallery-widget.js";
//import ImageGalleryPreview from "./image-gallery-preview.js";

CMS.registerPreviewStyle('/styles.css');
CMS.registerPreviewTemplate('footer', FooterPreview);
CMS.registerPreviewTemplate('articles', ArticlePreview);
CMS.registerPreviewTemplate('about', AboutPreview);
CMS.registerPreviewTemplate('homepage', HomepagePreview);


// Register the imported widget:
//CMS.registerWidget("image-gallery", ImageGalleryWidget, ImageGalleryPreview);