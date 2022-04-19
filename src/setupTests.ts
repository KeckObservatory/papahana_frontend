// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// learn more: https://github.com/testing-library/jest-dom

import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
configure({ adapter: new Adapter() });
