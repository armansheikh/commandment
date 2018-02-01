import * as React from "react";
import {StatelessComponent} from "react-redux";
import {WrappedFieldProps} from "redux-form";
import {Form, Input} from "semantic-ui-react";
import {SemanticWIDTHS} from "semantic-ui-react/src";

interface IFieldProps extends WrappedFieldProps<any> {
    label: string;
    type: string;
    id: string;
    tooltip: string;
    required: boolean;
    width: SemanticWIDTHS;
    action: string;
}

export const SemanticInput: StatelessComponent<IFieldProps> = ({input, label, type, meta: { touched, error, warning }, id, tooltip, required, width, action }) => (
    <Form.Input
        fluid
        {...input}
        label={label}
        type={type}
        error={touched && !!error}
        required={required}
        width={width}
        action={action}
    />
);
