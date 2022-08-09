import { teamsTheme, Provider } from '@fluentui/react-northstar';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, useRoutes, Navigate } from 'react-router-dom';
import { transformNameSpacedStyle, getAllVariables } from './loadBabel';
import { transformStylesObject } from 'v9helper-transform-style-object';
import { ColorTokenApp, TransformApp, IconMappingApp } from './pages';

const Transform = () => (
  <TransformApp
    transformNameSpacedStyle={transformNameSpacedStyle}
    transformStylesObject={transformStylesObject}
    getAllVariables={getAllVariables}
  />
);

const App = () => {
  const routes = useRoutes([
    { path: '/', element: <Transform /> },
    {
      path: 'transform',
      element: <Transform />,
    },
    { path: 'colors', element: <ColorTokenApp /> },
    { path: 'icons', element: <IconMappingApp /> },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ]);
  return routes;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider theme={teamsTheme}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <HashRouter>
          <App />
        </HashRouter>
      </div>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
