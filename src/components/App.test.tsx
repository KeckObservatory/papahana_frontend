import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { shallow } from "enzyme";
import { QueryParamProvider } from 'use-query-params';

const history = createBrowserHistory();

describe("<App />", () => {
  it('renders learn react link', async () => {
    shallow(
      <div>
        <Router {...{ history }}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <App />
          </QueryParamProvider>
        </Router>,
      </div>
    );
  });
  
  // const linkElement = screen.getByText(/Papahana/i);
  // expect(linkElement).toBeInTheDocument();
})