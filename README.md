## Demo : [https://mobile-pdf-upload-ten.vercel.app/](https://mobile-pdf-upload-ten.vercel.app/)

# React PDF Signer

A sleek and modern web application built with React and Material-UI that empowers users to upload, preview, and digitally sign PDF documents quickly and securely. Designed with a mobile-first approach, it offers a seamless and appealing experience on smartphones, tablets, and desktop devices.

***

## Features

- **Intuitive step-wise interface** guiding users through upload, sign, and completion stages.
- **Responsive design** optimized for all screen sizes, from mobile to desktop.
- **Flexible PDF upload** via drag-and-drop or file selection.
- **Instant in-browser PDF preview** before and after signing.
- **Digital signing** embedding a custom, Unicode-supporting checkmark.
- **Visual progress bar** with descriptive icons and connecting lines for clarity.
- **Lightweight and easy to customize** through `App.js` styling.

***

## Installation \& Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- npm (comes with Node.js)


### Get the code

```bash
git clone https://github.com/ShrutiLatthe1998/mobile-pdf-upload
cd mobile-pdf-upload
```


### Install dependencies

```bash
npm install
```


### Add the custom font

Place the font file `OpenSans-Regular.ttf` inside the `/public` directory of the project root. This ensures the font is accessible for embedding into PDFs.

### Start the development server

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to use the app.

***

## Usage

1. **Upload PDF:** Click “Choose File” or drag and drop a PDF to upload. The file name will display for confirmation.
2. **Sign PDF:** After uploading, click “Sign PDF” to digitally sign the document with a visible checkmark.
3. **View Signed PDF:** The signed PDF appears in a preview pane for immediate review.

***

## Customization

- Modify the UI styles, colors, and layout directly in `App.js`.
- Swap the embedded font by replacing the `/public/OpenSans-Regular.ttf` file and update the font import path accordingly.
- Extend functionality by adding features like multiple signatures, download options, or cloud storage integration.

***

## Notes

- This project depends on `@mui/material`, `@mui/icons-material`, `pdf-lib`, and `@pdf-lib/fontkit`.
- Ensure your embedded font includes all necessary Unicode glyphs.
- For production use, consider adding error handling, input validation, and accessibility enhancements.

***

***

Enjoy a smooth and efficient way to sign PDFs directly within your browser!

