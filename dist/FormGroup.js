"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGroup = void 0;
const react_1 = __importDefault(require("react"));
const FormGroup = ({ value, disabled, quickForm, onValueChange, invalidMessage, }) => {
    const properties = {
        value,
        disabled,
        placeholder: quickForm.placeholder,
        specifics: quickForm.specifics,
        className: `qf-form-group ${quickForm.className} ${invalidMessage ? "is-invalid" : ""}`,
        onChange: onValueChange,
    };
    return react_1.default.cloneElement(quickForm.type, properties);
};
exports.FormGroup = FormGroup;
