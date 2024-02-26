import { expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { UniversalForm } from "../src/index";

it("Correct test of Everything in Universal Form", () => {
  // Arrange
  const setUserObject = (newObj) => {
    userObj = newObj;
  };

  let userObj = {
    userName: "",
    password: "",
  };

  const quickForms = {
    userName: {
      type: "text",
    },
    password: {
      type: "password",
    },
  };

  let btnPressed = false;
  const onSubmitAsync = async () => {
    btnPressed = true;
  };

  // Act
  const { container } = render(
    <UniversalForm
      formObject={userObj}
      quickForms={quickForms}
      setFormObject={setUserObject}
      onSubmitAsync={onSubmitAsync}
    >
      <button type="submit">Press me</button>
    </UniversalForm>
  );

  // Assert
  const form = container.querySelector("form");
  expect(form).toBeInTheDocument();

  const textInput = container.querySelector('input[type="text"]');
  expect(textInput).toBeInTheDocument();

  const passwordInput = container.querySelector('input[type="password"]');
  expect(passwordInput).toBeInTheDocument();

  expect(userObj).toStrictEqual({ userName: "", password: "" });
  fireEvent.change(textInput, { target: { value: "newName" } });
  expect(userObj).toStrictEqual({ userName: "newName", password: "" });

  // Check state before Btn Press
  const btnInput = container.querySelector("button");
  expect(btnInput).toBeInTheDocument();
  expect(btnPressed).toBe(false);

  // Act Btn Press
  fireEvent.click(btnInput);
  expect(btnPressed).toBe(true);
});

it("clientValidationFunc is passed. Must validate the object and prevent from submit if there are client error", async () => {
  let userObj = { userName: "oldVal" };
  const userQF = { userName: { type: "text" } };
  const setUserObj = (obj) => {
    userObj = obj;
  };

  let submittedTimes = 0;
  const onSubmit = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        submittedTimes++;
      }, 10);
    });
  };

  const clientValidationFunc = () => {
    const errors = {};
    if (!userObj.userName) {
      errors.userName = "UserName is required";
    } else if (userObj.userName.length < 3) {
      errors.userName = "Must be at least 3 characters";
    }

    return errors;
  };

  const { container } = render(
    <UniversalForm
      formObject={userObj}
      quickForms={userQF}
      setFormObject={setUserObj}
      needsValidation={true}
      clientValidationFunc={clientValidationFunc}
      serverValidationFunc={undefined}
      onSubmitAsync={onSubmit}
    >
      <button type="submit">Press me</button>
    </UniversalForm>
  );

  const form = container.querySelector("form");

  expect(userObj).toEqual({ userName: "oldVal" });
  const input = form.querySelector("input[type='text'");
  fireEvent.change(input, {
    target: { value: "" },
  });
  expect(userObj).toEqual({ userName: "" });
  expect(form.querySelector(".qf-invalid-feedback")).not.toBeInTheDocument();

  expect(submittedTimes).toBe(0);
  const subBtn = form.querySelector("button[type='submit']");
  fireEvent.click(subBtn);

  expect(form.querySelector(".qf-invalid-feedback")).toBeInTheDocument();
  expect(submittedTimes).toBe(0);

  fireEvent.change(input, {
    target: { value: "12" },
  });
  fireEvent.click(subBtn);
  await new Promise((r) => setTimeout(r, 100));
  expect(form.querySelector(".qf-invalid-feedback")).toBeInTheDocument();
  expect(submittedTimes).toBe(0);

  fireEvent.change(input, {
    target: { value: "1234" },
  });
  fireEvent.click(subBtn);
  await new Promise((r) => setTimeout(r, 100));
  expect(form.querySelector(".qf-invalid-feedback")).not.toBeInTheDocument();
  expect(submittedTimes).toBe(1);
});

it("Must not throw error if needsValidation=true and clientValidationFunc is undefined when triggering a client error", () => {
  let userObj = { userName: "" };
  const userQF = { userName: { type: "text" } };
  const setUserObj = (obj) => {
    userObj = obj;
  };

  const { container } = render(
    <UniversalForm
      formObject={userObj}
      quickForms={userQF}
      setFormObject={setUserObj}
      needsValidation={true}
      clientValidationFunc={undefined}
      serverValidationFunc={undefined}
    >
      <button type="submit">Press me</button>
    </UniversalForm>
  );

  const form = container.querySelector("form");
  expect(form).toBeInTheDocument();

  const subBtn = form.querySelector("button[type='submit']");
  fireEvent.click(subBtn);

  expect(userObj).toEqual({ userName: "" });
  fireEvent.change(form.querySelector("input[type='text'"), {
    target: { value: "newVal" },
  });
  expect(userObj).toEqual({ userName: "newVal" });
});

it("Must not throw error if needsValidation=true and serverValidationFunc is undefined when triggering a server error", async () => {
  await serverValidationFuncTester(undefined);
});

it("needsValidation=true and serverValidationFunc is NOT undefined when triggering a server error. Must correctly get the error", async () => {
  let error = null;
  let userObj = {};
  const serverValidationFunc = (err, obj) => {
    error = err;
    userObj = obj;
  };

  await serverValidationFuncTester(serverValidationFunc);

  // OldVal because Jest cannot update formObject value from the inside of UniversalForm
  expect(userObj).toEqual({ userName: "oldVal" });
  expect(error.message).toEqual("Test error");
});

const serverValidationFuncTester = async (serverValidationFunc) => {
  let userObj = { userName: "oldVal" };
  const userQF = { userName: { type: "text" } };
  const setUserObj = (obj) => {
    userObj = obj;
  };

  let onSubmitWorked = false;
  const onSubmit = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        onSubmitWorked = true;
        reject(new Error("Test error"));
      }, 100);
    });
  };

  const { container } = render(
    <UniversalForm
      formObject={userObj}
      quickForms={userQF}
      setFormObject={setUserObj}
      needsValidation={true}
      clientValidationFunc={undefined}
      serverValidationFunc={serverValidationFunc}
      onSubmitAsync={onSubmit}
    >
      <button type="submit">Press me</button>
    </UniversalForm>
  );

  const form = container.querySelector("form");
  expect(form).toBeInTheDocument();

  expect(userObj).toEqual({ userName: "oldVal" });
  fireEvent.change(form.querySelector("input[type='text'"), {
    target: { value: "newVal" },
  });
  expect(userObj).toEqual({ userName: "newVal" });

  expect(onSubmitWorked).toBe(false);
  const subBtn = form.querySelector("button[type='submit']");
  fireEvent.click(subBtn);

  await new Promise((r) => setTimeout(r, 200));
  expect(onSubmitWorked).toBe(true);
};

it("Must correctly show given classname in form", () => {
  const { container } = render(
    <UniversalForm
      formObject={{}}
      quickForms={{}}
      setFormObject={({}) => {}}
      className={"user-defined-name"}
    ></UniversalForm>
  );

  const form = container.querySelector("form");
  expect(form.className).toEqual("qf-universal-form user-defined-name");
});

it("Must not show classname as undefined in form", () => {
  const { container } = render(
    <UniversalForm
      formObject={{}}
      quickForms={{}}
      setFormObject={({}) => {}}
      className={undefined}
    ></UniversalForm>
  );

  const form = container.querySelector("form");
  expect(form.className).toEqual("qf-universal-form");
});

it("Universal form correctly renders a button and doesn't throw an exception if Submit button is pressed while onSubmitAsync is undefined", () => {
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
  }).not.toThrow();
});

it("UniversalForm throws an exception if quickForms, formObject or setFormObject is undefined", () => {
  expectThrowExceptionTester({
    formObject: {},
    quickForms: {},
    setFormObject: undefined,
  });

  expectThrowExceptionTester({
    formObject: {},
    quickForms: undefined,
    setFormObject: () => {},
  });

  expectThrowExceptionTester({
    formObject: undefined,
    quickForms: {},
    setFormObject: () => {},
  });
});

const expectThrowExceptionTester = (props) => {
  // Act, Assert
  expect(() => render(<UniversalForm {...props} />)).toThrow(
    "quickForms, formObject or setFormObject must not be undefined"
  );
};
