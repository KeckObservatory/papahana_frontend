
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopBar } from './top_bar';
import { shallow } from "enzyme";
import { handleTheme } from './App'
import { ThemeProvider } from '@mui/styles';

const theme = handleTheme(true)

describe("top-bar", () => {
    it('renders learn react link', async () => {
        const wrapper = shallow(
            <ThemeProvider theme={theme}>
                <TopBar observer_id={'test_id'} darkState={true} handleThemeChange={() => { }} />
            </ThemeProvider>
        );
        const header = <h1>Welcome, Observer test_id!</h1>;
        console.log('wrapper', wrapper)
        // expect(wrapper.contains(welcome)).toBe(true);
        expect(wrapper.contains(header)).toEqual(true);
    });
})