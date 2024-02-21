import { expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { UniversalForm } from "../src/index";

it("Universal form doesn't throw an exception if Submit button is pressed", () => {
  const { container } = render(
    <UniversalForm
      formObject={{}}
      quickForms={{}}
      setFormObject={({}) => {}}
      onSubmitAsync={undefined}
    >
      <button type="submit">Press me</button>
    </UniversalForm>
  );

  const btn = container.querySelector("button");
  expect(() => {
    fireEvent.click(btn);
  }).not.toThrow("TypeError: onSubmitAsync is not a function");
});
