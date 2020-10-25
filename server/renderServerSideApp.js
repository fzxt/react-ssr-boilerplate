import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';

import App from '../src/components/App';
import { fetchDataForRender } from './fetchDataForRender';
import { indexHtml } from './indexHtml';

import { ServerDataProvider } from '../src/state/serverDataContext';

const statsFile = path.resolve('./build/react-loadable.json');
const chunkExtractor = new ChunkExtractor({ statsFile });

const ServerApp = ({ context, data, location }) => {
  return (
    <ServerDataProvider value={data}>
      <StaticRouter location={location} context={context}>
        <App />
      </StaticRouter>
    </ServerDataProvider>
  );
};

export const renderServerSideApp = (req, res) => {
  fetchDataForRender(ServerApp, req).then(data =>
    renderApp(ServerApp, data, req, res)
  );
};

function renderApp(ServerApp, data, req, res) {
  const context = {};

  const markup = ReactDOMServer.renderToString(
    <ChunkExtractorManager extractor={chunkExtractor}>
      <ServerApp location={req.url} data={data} context={context} />
    </ChunkExtractorManager>
  );

  if (context.url) {
    res.redirect(context.url);
  } else {
    const fullMarkup = indexHtml({
      helmet: Helmet.renderStatic(),
      serverData: data,
      chunkExtractor,
      markup
    });

    res.status(200).send(fullMarkup);
  }
}
