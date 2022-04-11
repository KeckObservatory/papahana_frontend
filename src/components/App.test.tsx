import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { QueryParamProvider } from 'use-query-params';

const history = createBrowserHistory();

describe("<App />", () => {
  test('renders learn react link', async () => {
    render(
      <div>
        <Router {...{ history }}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <App />
          </QueryParamProvider>
        </Router>,
      </div>
    );
  });
})