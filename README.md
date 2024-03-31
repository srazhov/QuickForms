# QuickForms

With **QuickForms** you can:
 - Create fast and easily configurable Forms which uses only your **form model**, **QuickForm** to specify what this field do and **UniversalForm** as a wrapper
 - Create your own components, which allow you to manage your data with complex structure

[GitHub Page](https://github.com/srazhov/QuickForms)

[NpmJS Page](https://www.npmjs.com/package/universal-quick-forms)



## To contributors

This is my first public GitHub project, where I expect other people to use it. 

It's not perfect, in fact, there are a lot of problems: the incomplete documentation (in progress), not totally correct tests, and I am not sure, if anyone ever will need this tool, though, I use it a lot in my projects.

I don't know how exactly contributors work in GitHub, but if anyone would like to test my solution to automate React JS forms in their project, I'll be very happy to receive any issues reported or even fixing them.

I'll update the README until the how-to section is finally finished.

Thank you! 



## Table of Content
- [Installation](#installation)
- [How to use](#how-to-use)
- [QuickForms object](#quickforms-object)
- [UniversalForm](#universalform)
	- [formObject](#formobject)
	- [setFormObject](#setformobject)
	- [onSubmitAsync](#onsubmitasync)
	- [quickForms](#quickforms)
	- [allDisabled](#alldisabled)
	- [needsValidation](#needsvalidation)
- [Validation](#validation)
	- [clientValidationFunc](#clientvalidationfunc)
	- [serverValidationFunc](#servervalidationfunc)

## Installation

In terminal you write:

    npm install universal-quick-forms

Package uses and is designed for ReactJS, so obviously, it's required to have it :)

## How to use
Create [form model](#formobject)
**Note**: It's important to use React's useState hook to work properly

    const [registerUserModel, setRegisterUserModel] = useState({
      userName: ''
      password: ''
      repeatPassword: ''
    });

Create [QuickForm object](#quickforms-object)
**Note**: every field of the QuickForm object must match the name of FormModel 

    const registerUserQuickForm = {
	  userName: {
	    type: 'text',
	    placeholder: 'User Name'
	  },
	  password: {
	    type: 'password',
	    placeholder: 'Password'
	  },
	  repeatPassword: {
	    type: 'password',
	    placeholder: 'Repeat Password'
	  }
    };

Finally, call [UniversalForm.](#universalform)

    return (<UniversalForm
      formObject={registerUserModel}
      quickForms={registerUserQuickForm}
      setFormObject={setRegisterUserModel}>
        <button type="submit">Press me</button>
    </UniversalForm>);


## QuickForms object

## UniversalForm

### formObject
### setFormObject
### onSubmitAsync
### quickForms

The object which consists of QuickForms fields.
Must contain fields which names are exactly like formObject's field names.
Values of the fields must be [QuickForm object](#quickforms-object)

Example:

    const userQF = {
	  userName: {
	    type: 'text'
	  },
	  password: {
	    type: 'password',		
	  }
    }; 
    
	return (<UniversalForm
	  formObject={userObj}
	  quickForms={userQF}
	  setFormObject={setUserObj}>
	    <button type="submit">Press me</button>
	</UniversalForm>);


### allDisabled

Boolean value.
If it's *true*, then all of the components are set to disabled
By default *false*

### needsValidation

Boolean value.
Set to *true*, if you need to have a validation of the form;
By default *false*

Example:

    const  clientValidationFunc = (formObj) => {};  
	const  serverValidationFunc = (serverErrors, formObj) => {};
	// See below for implementation of these functions 
	
	return (<UniversalForm
	  formObject={userObj}
	  quickForms={userQF}
	  setFormObject={setUserObj}
	  needsValidation={true} // If false, ignore validation checks
	  clientValidationFunc={clientValidationFunc}
	  serverValidationFunc={serverValidationFunc}>
	    <button type="submit">Press me</button>
	</UniversalForm>);

## Validation
You can have custom validations of any of your components before and after making a server request.

A user would see a **validation errors** (if present) only after he/she **tries to make the first submit**.
After the first submit, on every change of the value *clientValidationFunc* is triggered.

If *clientValidationFunc* check was OK, then the submit to the server is performed.
If server responded with "HTTP 400 Bad Request", *serverValidationFunc* is triggered.

### clientValidationFunc
A function which works every time a user change any value of the components.

The function receives *formObj* with the current state of the object.

Must return object *errors*, where field names are exactly like the formObject's field names.
Value of those fields must be *string*. This string value is displayed as the errors of components

Example:

    const  clientValidationFunc = (testingObj) => {
      const  errors = {};
      if (!testingObj.userName) {
        errors.userName = "UserName is required";
      } else  if (testingObj.userName.length < 3) {
        errors.userName = "Must be at least 3 characters";
      }

      return  errors; // Must return {key: 'value'} object 
        where 'key'-s are the same as formObj's field names 
      };
	
      return (<UniversalForm
        formObject={userObj}
        quickForms={userQF}
        setFormObject={setUserObj}
        needsValidation={true} // If false, ignore validation checks
        clientValidationFunc={clientValidationFunc}>
          <button type="submit">Press me</button>
      </UniversalForm>);

### serverValidationFunc
In case if Server responded with "HTTP 400 Bad Request" and the response contains server model errors, you can display the server message to the user by using *serverValidationFunc* function.

The function receives *serverErrors* as the response from the server, and *formObj* with the current state of the object.

Must return object *errors*, where field names are exactly like the formObject's field names.
Value of those fields must be *string*. This string value is displayed as the errors of components

Example:

    const  serverValidationFunc = (serverErrors, formObj) => {
      const serErr = serverErrors.response.data.errors; // Axios response object
      const errors = {};
      Object.keys(serErr).map(err  =>  errors[err] = serErr[err][0]);

      return  errors;
    };
	
    return (<UniversalForm
      formObject={userObj}
      quickForms={userQF}
      setFormObject={setUserObj}
      needsValidation={true} // If false, ignore validation checks
      serverValidationFunc={serverValidationFunc}>
        <button type="submit">Press me</button>
    </UniversalForm>);

In this case we just need to map server response to the default *errors* object.
In the example above axios' *post* method is used. 
