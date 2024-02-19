import { expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { FormGroup } from "../src/FormGroup";
it("Undefined quickForm is passed to FormGroup. Must return an error", () => {
  // Arrange
  const quickForm = undefined;

  // Act, Assert
  expect(() => render(<FormGroup quickForm={quickForm} />)).toThrow(
    "quickForm or its type must not be undefined"
  );
});

it("Undefined type of quickForm is passed to FormGroup. Must return an error", () => {
  // Arrange
  const quickForm = { type: undefined };

  // Act, Assert
  expect(() => render(<FormGroup quickForm={quickForm} />)).toThrow(
    "quickForm or its type must not be undefined"
  );
});
