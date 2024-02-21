import { expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { FormGroup } from "../src/FormGroup";

it("QuickForm type of string is passed. Should render <input type=text /> with all attributes it can have", () => {
  // Arrange
  const value = "testValue";
  const quickForm = {
    type: "text",
    className: "test-class-name",
    specifics: { minLength: 3, required: true },
  };

  // Act
  const { container } = render(
    <FormGroup value={value} quickForm={quickForm}></FormGroup>
  );

  // Assert
  const divContainer = container.querySelector("div");
  expect(divContainer).toHaveAttribute(
    "class",
    "qf-form-group test-class-name "
  );

  const input = divContainer.querySelector("input");
  expect(input).toBeInTheDocument();
  expect(input).not.toHaveAttribute("specifics");

  expect(input).toHaveAttribute("type", "text");
  expect(input).toHaveAttribute("value", "testValue");
  expect(input).toHaveAttribute("minLength", "3");
  expect(input).toHaveAttribute("required");
});

it("Complex control passed into a QuickForm type. Complex text must render correctly and have all fields available", () => {
  // Arrange
  const value = "testValue";
  let valTracker = "no-change";
  const onChange = (e) => {
    valTracker = e.target.value;
  };

  const quickForm = {
    type: <ComplexText />,
    label: "testLabel",
    id: "testId",
    specifics: { minLength: 3, disabled: true },
    className: "test-class-name",
  };

  // Act
  const { container } = render(
    <FormGroup
      value={value}
      quickForm={quickForm}
      onValueChange={onChange}
      invalidMessage="test-invalid"
    ></FormGroup>
  );

  // Assert
  const divContainer = container.querySelector("div.test-class-name");
  expect(divContainer).toBeInTheDocument();

  const label = divContainer.querySelector("label");
  expect(label.textContent).toEqual("testLabel");

  const input = divContainer.querySelector("input");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("type", "text");
  expect(input).toHaveAttribute("value", "testValue");
  expect(input).toHaveAttribute("disabled");
  expect(input).toHaveAttribute("id", "testId");
  expect(input).toHaveAttribute("minLength", "3");

  expect(valTracker).toBe("no-change");
  fireEvent.change(input, { target: { value: "changed" } });
  expect(valTracker).toBe("changed");

  const lbl = divContainer.querySelector(".invalid-lbl");
  expect(lbl.textContent).toEqual("test-invalid");
});

const ComplexText = ({
  className,
  invalidMessage,
  onChange,
  specifics,
  id,
  value,
  disabled,
  label,
}) => {
  return (
    <div className={className}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        id={id}
        onChange={onChange}
        minLength={specifics.minLength}
      />
      <div className="invalid-lbl">{invalidMessage}</div>
    </div>
  );
};

it("onvalueChange is passed into type:text object. Must work correctly", () => {
  // Arrange
  const quickForm = {
    type: "text",
  };

  let value = "not-changed";
  const onValueChangeFn = (e) => {
    value = e;
  };

  // Act
  const { container } = render(
    <FormGroup
      value={value}
      quickForm={quickForm}
      onValueChange={onValueChangeFn}
    ></FormGroup>
  );

  // Assert
  expect(value).toEqual("not-changed");

  // Act
  const newPassedValue = "new-value";
  const input = container.querySelector("input");
  fireEvent.change(input, { target: { value: newPassedValue } });

  // Assert
  expect(value).toEqual("new-value");
});

it("invalidMessage is passed. Must render invalid-feedback message", () => {
  // Arrange
  const value = "incorrect value";
  const invMsg = "value is incorrect";
  const quickForm = {
    type: "text",
  };

  // Act
  const { container } = render(
    <FormGroup
      value={value}
      quickForm={quickForm}
      invalidMessage={invMsg}
    ></FormGroup>
  );

  // Assert
  const input = container.querySelector("input");
  expect(input).toHaveAttribute("value", "incorrect value");

  const divContainer = container.querySelector("div.is-invalid");
  expect(divContainer).toBeInTheDocument();

  const invMsgLabel = divContainer.querySelector("div.invalid-feedback");
  expect(invMsgLabel).toBeInTheDocument();
  expect(invMsgLabel.textContent).toEqual("value is incorrect");
});

it("quickForm.label is passed. Must render label", () => {
  // Arrange
  const value = "testValue";
  const quickForm = {
    type: "text",
    label: "test Label text",
  };

  // Act
  const { container } = render(
    <FormGroup value={value} quickForm={quickForm}></FormGroup>
  );

  // Assert
  const input = container.querySelector("input");
  expect(input).toHaveAttribute("value", "testValue");

  const label = container.querySelector("label");
  expect(label).toBeInTheDocument();
  expect(label.textContent).toEqual("test Label text");

  expect(label.getAttribute("for")).toBeTruthy();
  expect(label.getAttribute("for")).toEqual(input.getAttribute("id"));
});

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

it("CheckBox type is passed as QuickForm. Must render it as checked and correctly update 'checked' field ", () => {
  checkboxOrRadioBtnTest("checkbox", true);
});

it("Radio type is passed as QuickForm. Must render it as checked and correctly update 'checked' field ", () => {
  // Radio btn's checked value cannot become false after it was initialized as true
  checkboxOrRadioBtnTest("radio", true, false);
});

it("CheckBox type is passed as QuickForm. Must not be checked and correctly update 'checked' field ", () => {
  checkboxOrRadioBtnTest("checkbox", false);
});

it("Radio type is passed as QuickForm. Must not be checked and correctly update 'checked' field ", () => {
  checkboxOrRadioBtnTest("radio", false);
});

const checkboxOrRadioBtnTest = (
  type,
  firstValue,
  checkForValueTriggered = true
) => {
  // Arrange
  const value = firstValue;
  const quickForm = {
    type: type,
  };

  let valueTriggered = false;
  const onChange = (e) => {
    valueTriggered = true;
  };

  // Act
  const { container } = render(
    <FormGroup
      value={value}
      quickForm={quickForm}
      onValueChange={onChange}
    ></FormGroup>
  );

  // Assert
  const input = container.querySelector(`input[type='${type}']`);
  expect(input).toBeInTheDocument();

  expect(input).not.toHaveAttribute("value");
  if (firstValue == true) {
    expect(input).toHaveAttribute("checked");
  } else {
    expect(input).not.toHaveAttribute("checked");
  }

  fireEvent.click(input);
  if (checkForValueTriggered === true) {
    expect(valueTriggered).toBe(true);
  }
};
