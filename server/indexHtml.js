import { getAppEnv } from '../config/env';

const env = getAppEnv();
const { NODE_ENV } = env.raw;

let assetManifest;
if (NODE_ENV === 'production') {
  assetManifest = require('../build/asset-manifest.json');
} else {
  assetManifest = {
    'main.js': '/main.bundle.js'
  };
}

export const indexHtml = ({ helmet, serverData, markup, chunkExtractor }) => {
  const htmlAttrs = helmet.htmlAttributes.toString();
  const bodyAttrs = helmet.bodyAttributes.toString();

  return `
    <!doctype html>
    <html lang="en" ${htmlAttrs}>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}

        ${chunkExtractor.getLinkTags()}
        ${chunkExtractor.getStyleElements()}
        ${helmet.link.toString()}
        ${chunkExtractor.getStyleTags()}
        ${helmet.style.toString()}

        ${helmet.noscript.toString()}
        ${helmet.script.toString()}
        ${chunkExtractor.getScriptTags()}
      </head>
      <body ${bodyAttrs}>
        <div id="root">${markup}</div>

        <script>
          window.process = ${env.forIndexHtml};
          window.__SERVER_DATA__ = ${JSON.stringify(serverData)}
          window.__ASSET_MANIFEST__ = ${JSON.stringify(assetManifest)}
        </script>
      </body>
    </html>
  `;
};
