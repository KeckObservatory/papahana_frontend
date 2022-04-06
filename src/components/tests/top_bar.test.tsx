/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { TopBar } from "./../top_bar";

test("TopBar contains correct text", () => {
  render(<TopBar observer_id={"2003"} darkState={true} handleThemeChange={() =>{}}/>);
  const text = screen.getByText("My React and TypeScript App");
  expect(text).toBeInTheDocument();
});