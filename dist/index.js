"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalForm = void 0;
const react_1 = __importStar(require("react"));
const FormGroup_1 = require("./FormGroup");
const UniversalForm = ({ className = "", formObject, setFormObject, onSubmitAsync, quickForms, allDisabled = false, needsValidation = false, clientValidationFunc, serverValidationFunc, children, }) => {
    if (!quickForms || !formObject || !setFormObject) {
        throw new Error("quickForms, formObject or setFormObject must not be undefined");
    }
    const [isValidated, setIsValidated] = (0, react_1.useState)(false);
    const [errorMessages, setErrorMessages] = (0, react_1.useState)({});
    const checkValidation = (curFormObject, serverErrors) => {
        if (!needsValidation) {
            return true;
        }
        setIsValidated(true);
        let errors = {};
        if (serverErrors && serverValidationFunc) {
            errors = serverValidationFunc(serverErrors, curFormObject);
            console.error(serverErrors);
        }
        else if (clientValidationFunc) {
            errors = clientValidationFunc(curFormObject);
        }
        errors = errors !== null && errors !== void 0 ? errors : {};
        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };
    const onSubmitBtn = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        e.stopPropagation();
        if (!checkValidation(formObject, null)) {
            return;
        }
        if (!onSubmitAsync) {
            return;
        }
        yield onSubmitAsync(formObject).catch((reason) => {
            checkValidation(formObject, reason);
        });
    });
    const onValueChange = (name, val) => {
        const newFormObj = Object.assign(Object.assign({}, formObject), { [name]: val });
        if (isValidated) {
            checkValidation(newFormObj, null);
        }
        setFormObject(newFormObj);
    };
    return (react_1.default.createElement("form", { className: `qf-universal-form ${className ? className : ""}`.trim(), onSubmit: onSubmitBtn, noValidate: true },
        Object.keys(formObject)
            .filter((name, _) => quickForms[name].display !== false)
            .map((item, index) => (react_1.default.createElement(FormGroup_1.FormGroup, { value: formObject[item], disabled: allDisabled, quickForm: quickForms[item], invalidMessage: errorMessages[item], onValueChange: (val) => {
                onValueChange(item, val);
            }, key: `qf-form-group-${index}-${item}` }))),
        children));
};
exports.UniversalForm = UniversalForm;
