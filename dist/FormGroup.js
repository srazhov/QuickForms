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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGroup = void 0;
const react_1 = __importStar(require("react"));
const FormGroup = ({ value, disabled, invalidMessage, onValueChange, quickForm, }) => {
    var _a, _b, _c, _d;
    if (!quickForm || !quickForm.type) {
        throw new Error("quickForm or its type must not be undefined");
    }
    const properties = {
        id: (_a = quickForm.id) !== null && _a !== void 0 ? _a : (0, react_1.useId)(),
        value,
        disabled: disabled || ((_b = quickForm.specifics) === null || _b === void 0 ? void 0 : _b.disabled),
    };
    const className = `qf-form-group ${(_c = quickForm.className) !== null && _c !== void 0 ? _c : ""} ${invalidMessage ? "is-invalid" : ""}`;
    if (typeof quickForm.type === "string") {
        if (quickForm.specifics) {
            for (const s in quickForm.specifics) {
                properties[s] = quickForm.specifics[s];
            }
        }
        if (quickForm.type === "checkbox" || quickForm.type === "radio") {
            properties.checked = properties.value;
            delete properties.value;
            properties.onChange = (e) => {
                onValueChange(e.target.checked);
            };
        }
        else {
            properties.onChange = (e) => {
                onValueChange(e.target.value);
            };
        }
        const label = quickForm.label ? (react_1.default.createElement("label", { className: `qf-label ${(_d = quickForm.labelClass) !== null && _d !== void 0 ? _d : ""}`, htmlFor: properties.id }, quickForm.label)) : null;
        return (react_1.default.createElement("div", { className: className },
            label,
            react_1.default.createElement("input", Object.assign({ type: quickForm.type }, properties)),
            invalidMessage && (react_1.default.createElement("div", { className: "invalid-feedback" }, invalidMessage))));
    }
    properties.onChange = onValueChange;
    properties.invalidMessage = invalidMessage;
    properties.className = className;
    properties.specifics = quickForm.specifics;
    properties.label = quickForm.label;
    return react_1.default.cloneElement(quickForm.type, properties);
};
exports.FormGroup = FormGroup;
