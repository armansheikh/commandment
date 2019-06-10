import {Field, Form as FormikForm, Formik, FormikBag, FormikErrors, FormikProps, withFormik} from "formik";
import * as React from "react";
import * as Yup from "yup";
import {Organization} from "../../store/organization/types";

import {
    Button,
    Divider,
    Label,
    Form,
    Header,
    Icon,
    Grid
} from "semantic-ui-react";

export interface IOrganizationFormProps {
    data?: Organization;
    id?: string | number;
    loading: boolean;
    onSubmit: (values: IOrganizationFormValues) => void;
}

export interface IOrganizationFormValues extends Organization {

}

const initialValues: IOrganizationFormValues = {
    name: "",
    payload_prefix: "org.github.cmdmnt",
    x509_c: "US",
    x509_o: "",
    x509_ou: "",
    x509_st: "",
};

const InnerForm = ({
   handleSubmit,
   handleChange,
   handleBlur,
   values,
   errors,
   touched,
   isSubmitting,
}: FormikProps<IOrganizationFormValues>) => (
    <Form onSubmit={handleSubmit}>
        <Form.Field required>
            <label>Name</label>
            <input type="text" name="name"
                   placeholder="Acme Inc."
                   onChange={handleChange} onBlur={handleBlur}
                   value={values.name}/>

            {errors.name &&
            touched.name &&
            <Label pointing>{errors.name}</Label>}
        </Form.Field>

        <Form.Field required>
            <label>Payload Prefix</label>
            <input type="text" name="payload_prefix"
                   onChange={handleChange} onBlur={handleBlur}
                   placeholder="com.acme"
                   value={values.payload_prefix}/>

            {errors.payload_prefix &&
            touched.payload_prefix &&
            <Label pointing>{errors.payload_prefix}</Label>}
        </Form.Field>

        <Header as="h3"><Icon name="certificate"/> Certificate Details</Header>
        <Grid columns={2}>
            <Grid.Column>
                <Form.Field>
                    <label>X.509 Organizational Unit</label>
                    <input type="text" name="x509_ou"
                           onChange={handleChange} onBlur={handleBlur}
                           placeholder="IT Department"
                           value={values.x509_ou}/>

                    {errors.x509_ou &&
                    touched.x509_ou &&
                    <Label pointing>{errors.x509_ou}</Label>}
                </Form.Field>
                <Form.Field>
                    <label>X.509 Organization</label>
                    <input type="text" name="x509_o"
                           onChange={handleChange} onBlur={handleBlur}
                           placeholder="Acme Inc."
                           value={values.x509_o}/>

                    {errors.x509_o &&
                    touched.x509_o &&
                    <Label pointing>{errors.x509_o}</Label>}
                </Form.Field>
            </Grid.Column>
            <Grid.Column>
                <Form.Field>
                    <label>X.509 State</label>
                    <input type="text" name="x509_st"
                           onChange={handleChange} onBlur={handleBlur}
                           value={values.x509_st}/>

                    {errors.x509_st &&
                    touched.x509_st &&
                    <Label pointing>{errors.x509_st}</Label>}
                </Form.Field>
                <Form.Field>
                    <label>X.509 Country Code</label>
                    <input type="text" name="x509_c"
                           onChange={handleChange} onBlur={handleBlur}
                           placeholder="US"
                           value={values.x509_c}/>

                    {errors.x509_c &&
                    touched.x509_c &&
                    <Label pointing>{errors.x509_c}</Label>}
                </Form.Field>
            </Grid.Column>
        </Grid>

        <Divider hidden/>

        <Button type="submit" disabled={isSubmitting} primary>
            Update
        </Button>
    </Form>
);

export const OrganizationForm = withFormik<IOrganizationFormProps, IOrganizationFormValues>({
    displayName: "OrganizationForm",
    enableReinitialize: true,
    handleSubmit: (values, formikBag: FormikBag<IOrganizationFormProps, IOrganizationFormValues>) => {
        formikBag.props.onSubmit(values);
        formikBag.setSubmitting(false);
    },

    mapPropsToValues: (props) => {
        return props.data || initialValues;
    },

    validationSchema: Yup.object().shape({
        name: Yup.string().required("Required"),
        payload_prefix: Yup.string().required("Required"),
    }),
})(InnerForm);
