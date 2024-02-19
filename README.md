# QuickForms

With **QuickForms** you can:

- Create fast and easily configurable Forms which uses only your **form model**, **QuickForm** to specify what this field do and **UniversalForm** as a wrapper
- Create your own components, which allow you to manage your data with complex structure

## Installation

In terminal you write:

    npm install universal-quick-forms

## How to use

Create form model

    const registerUserModel = {
      userName: ''
      password: ''
      repeatPassword: ''
    };

Create QuickForm object.
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

[https://stackedit.io/app#](StackEdit)
