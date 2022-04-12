import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { shallow, configure } from "enzyme";
import { QueryParamProvider } from 'use-query-params';
configure({ adapter: new Adapter() });

// jest.mock('axios', () => {
//   return {
//     create: jest.fn(() => ({
//       get: jest.fn(),
//       interceptors: {
//         request: { use: jest.fn(), eject: jest.fn() },
//         response: { use: jest.fn(), eject: jest.fn() }
//       }
//     }))
//   }
// })

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