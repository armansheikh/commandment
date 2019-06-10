import {Field, Form as FormikForm, Formik, FormikBag, FormikErrors, FormikProps, withFormik} from "formik";
import * as React from "react";
import {
    AccordionTitleProps,
    CheckboxProps,
    Form,
    Button,
    Divider,
    Icon,
    Label,
    Accordion,
    FormProps
} from "semantic-ui-react";

import * as Yup from "yup";
import {DEPProfile, SkipSetupSteps} from "../../store/dep/types";
import {FormikCheckbox} from "../formik/FormikCheckbox";

// The major difference between the form values and the server-side model is that the skip values are boolean inverted
// so that we can use the language "show" instead of hidden / unhide.
export interface IDEPProfileFormValues {
    // show: not present on DEPProfile
    show: { [SkipSetupSteps: string]: boolean };
    readonly id?: string;
    readonly uuid?: string;
    dep_account_id?: number;

    profile_name: string;
    url?: string;
    allow_pairing: boolean;
    is_supervised: boolean;
    is_multi_user: boolean;
    is_mandatory: boolean;
    await_device_configured: boolean;
    is_mdm_removable: boolean;
    support_phone_number: string;
    auto_advance_setup: boolean;
    support_email_address?: string;
    org_magic?: string;
    // inverted by the form
    // skip_setup_items: SkipSetupSteps[];
    department?: string;
}

export interface IDEPProfileFormProps {
    data?: IDEPProfileFormValues;
    id?: string | number;
    loading: boolean;
    activeIndex: number;
    onSubmit: (values: IDEPProfileFormValues) => void;
    onClickAccordionTitle: (event: React.MouseEvent<any>, data: AccordionTitleProps) => void;
}

export interface IDEPProfileFormState {
    activeIndex: number;
}

export enum DEPProfilePairWithOptions {
    AnyComputer = "AnyComputer",
    Certificates = "Certificates",
}

const initialValues: IDEPProfileFormValues = {
    allow_pairing: true,
    auto_advance_setup: false,
    await_device_configured: false,
    department: "",
    is_mandatory: false,
    is_mdm_removable: true,
    is_multi_user: false,
    is_supervised: true,
    org_magic: "",
    profile_name: "",
    show: {
        [SkipSetupSteps.AppleID]: true,
        [SkipSetupSteps.Biometric]: true,
        [SkipSetupSteps.Diagnostics]: true,
        [SkipSetupSteps.DisplayTone]: true,
        [SkipSetupSteps.Location]: true,
        [SkipSetupSteps.Passcode]: true,
        [SkipSetupSteps.Payment]: true,
        [SkipSetupSteps.Privacy]: true,
        [SkipSetupSteps.Restore]: true,
        [SkipSetupSteps.SIMSetup]: true,
        [SkipSetupSteps.Siri]: true,
        [SkipSetupSteps.TOS]: true,
        [SkipSetupSteps.Zoom]: true,
        [SkipSetupSteps.Android]: true,
        [SkipSetupSteps.HomeButtonSensitivity]: true,
        [SkipSetupSteps.iMessageAndFaceTime]: true,
        [SkipSetupSteps.OnBoarding]: true,
        [SkipSetupSteps.ScreenTime]: true,
        [SkipSetupSteps.SoftwareUpdate]: true,
        [SkipSetupSteps.WatchMigration]: true,
        [SkipSetupSteps.Appearance]: true,
        [SkipSetupSteps.FileVault]: true,
        [SkipSetupSteps.iCloudDiagnostics]: true,
        [SkipSetupSteps.iCloudStorage]: true,
        [SkipSetupSteps.Registration]: true,
        [SkipSetupSteps.ScreenSaver]: true,
        [SkipSetupSteps.TapToSetup]: true,
        [SkipSetupSteps.TVHomeScreenSync]: true,
        [SkipSetupSteps.TVProviderSignIn]: true,
        [SkipSetupSteps.TVRoom]: true,
    },
    support_email_address: "",
    support_phone_number: "",
};

export interface IInnerFormProps {
    activeIndex: number | string;
    id?: number | string;
    onClickAccordionTitle: (event: React.MouseEvent<any>, data: AccordionTitleProps) => void;
}

const InnerForm = (props: IInnerFormProps & FormikProps<IDEPProfileFormValues>) => {
    const { touched, errors, isSubmitting, activeIndex, handleChange,
        handleBlur, values, id, handleSubmit, onClickAccordionTitle } = props;

    return (
        <Form onSubmit={handleSubmit}>
            <Accordion fluid styled>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={onClickAccordionTitle}>
                    <Icon name="dropdown"/>
                    General
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <Form.Field required>
                        <label>Profile Name</label>
                        <input type="text" name="profile_name"
                               onChange={handleChange} onBlur={handleBlur}
                               value={values.profile_name}/>

                        {errors.profile_name &&
                        touched.profile_name &&
                        <Label pointing>{errors.profile_name}</Label>}
                    </Form.Field>

                    <Form.Field>
                        <label>Support Phone Number</label>
                        <input type="tel" name="support_phone_number"
                               onChange={handleChange} onBlur={handleBlur}
                               value={values.support_phone_number}/>
                        {errors.support_phone_number &&
                        touched.support_phone_number &&
                        errors.support_phone_number}
                    </Form.Field>
                    <Form.Field>
                        <label>Support E-mail Address</label>
                        <input type="email" name="support_email_address"
                               onChange={handleChange} onBlur={handleBlur}
                               value={values.support_email_address}/>
                        {errors.support_email_address &&
                        touched.support_email_address &&
                        errors.support_email_address}
                    </Form.Field>

                    <Form.Field>
                        <label>Department</label>
                        <input type="text" name="department"
                               onChange={handleChange} onBlur={handleBlur}
                               value={values.department}/>
                        {errors.department &&
                        touched.department &&
                        errors.department}
                    </Form.Field>

                    <FormikCheckbox toggle name="allow_pairing" label="Allow Pairing"/>
                    <FormikCheckbox toggle name="is_supervised"
                                    label="Supervised (will be required in a future version of iOS)"
                                    defaultChecked/>
                    <FormikCheckbox toggle name="is_multi_user" label="Shared iPad" />
                    <FormikCheckbox toggle name="is_mandatory"
                                    label="Mandatory. User cannot skip Remote Management" />
                    <FormikCheckbox toggle name="await_device_configured" label="Await Configured" />
                    <FormikCheckbox toggle name="is_mdm_removable" label="MDM Payload Removable" />
                    <FormikCheckbox toggle name="auto_advance_setup" label="Auto Advance (tvOS)" />
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 1} index={1} onClick={onClickAccordionTitle}>
                    <Icon name="dropdown"/>
                    Setup Assistant Steps (Common)
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.AppleID}`}
                                    label="Show Apple ID Setup"
                                    value={SkipSetupSteps.AppleID}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Biometric}`} label="Show Touch ID"
                                    value={SkipSetupSteps.Biometric}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Diagnostics}`}
                                    label="Show Diagnostics"
                                    value={SkipSetupSteps.Diagnostics}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.DisplayTone}`}
                                    label="Show DisplayTone"
                                    value={SkipSetupSteps.DisplayTone}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Location}`}
                                    label="Show Location Services"
                                    value={SkipSetupSteps.Location}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Passcode}`}
                                    label="Show Passcode Setup"
                                    value={SkipSetupSteps.Passcode}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Payment}`} label="Show Apple Pay"
                                    value={SkipSetupSteps.Payment}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Privacy}`} label="Show Privacy"
                                    value={SkipSetupSteps.Privacy}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Restore}`}
                                    label="Show Restore from Backup"
                                    value={SkipSetupSteps.Restore}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.SIMSetup}`}
                                    label="Show Add Cellular Plan"
                                    value={SkipSetupSteps.SIMSetup}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Siri}`} label="Show Siri"
                                    value={SkipSetupSteps.Siri}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.TOS}`}
                                    label="Show Terms and Conditions"
                                    value={SkipSetupSteps.TOS}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Zoom}`} label="Show Zoom"
                                    value={SkipSetupSteps.Zoom}/>
                </Accordion.Content>
                <Accordion.Title active={activeIndex === 2} index={2} onClick={onClickAccordionTitle}>
                    <Icon name="dropdown" />
                    Setup Assistant Steps (iOS)
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Android}`}
                                    label="Show Restore from Android"
                                    value={SkipSetupSteps.Android} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.HomeButtonSensitivity}`}
                                    label="Show Home Button Sensitivity"
                                    value={SkipSetupSteps.HomeButtonSensitivity} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.iMessageAndFaceTime}`}
                                    label="Show iMessage and FaceTime"
                                    value={SkipSetupSteps.iMessageAndFaceTime} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.OnBoarding}`}
                                    label="Show On-Boarding"
                                    value={SkipSetupSteps.OnBoarding}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.ScreenTime}`}
                                    label="Show Screen Time"
                                    value={SkipSetupSteps.ScreenTime}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.SoftwareUpdate}`}
                                    label="Show Mandatory Software Update Screen"
                                    value={SkipSetupSteps.SoftwareUpdate}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.WatchMigration}`}
                                    label="Show Watch Migration"
                                    value={SkipSetupSteps.WatchMigration} />
                </Accordion.Content>
                <Accordion.Title active={activeIndex === 3} index={3} onClick={onClickAccordionTitle}>
                    <Icon name="dropdown" />
                    Setup Assistant Steps (macOS)
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 3}>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Appearance}`}
                                    label="Show Choose your Look"
                                    value={SkipSetupSteps.Appearance} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.FileVault}`}
                                    label="Show FileVault on macOS"
                                    value={SkipSetupSteps.FileVault} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.iCloudDiagnostics}`}
                                    label="Show iCloud Analytics"
                                    value={SkipSetupSteps.iCloudDiagnostics} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.iCloudStorage}`}
                                    label="Show iCloud Desktop and Documents"
                                    value={SkipSetupSteps.iCloudStorage} />
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.Registration}`}
                                    label="Show Registration"
                                    value={SkipSetupSteps.Registration} />
                </Accordion.Content>
                <Accordion.Title active={activeIndex === 4} index={4} onClick={onClickAccordionTitle}>
                    <Icon name="dropdown" />
                    Setup Assistant Steps (tvOS)
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 4}>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.ScreenSaver}`}
                                    label="Show Screen about using Aerial Screensavers in ATV"
                                    value={SkipSetupSteps.ScreenSaver}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.TapToSetup}`}
                                    label="Show Tap to Set Up option in ATV"
                                    value={SkipSetupSteps.TapToSetup}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.TVHomeScreenSync}`}
                                    label="Show home screen layout sync"
                                    value={SkipSetupSteps.TVHomeScreenSync}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.TVProviderSignIn}`}
                                    label="Show TV provider sign in"
                                    value={SkipSetupSteps.TVProviderSignIn}/>
                    <FormikCheckbox toggle name={`show.${SkipSetupSteps.TVRoom}`}
                                    label='Show "Where is this Apple TV?" screen'
                                    value={SkipSetupSteps.TVRoom}/>
                </Accordion.Content>
            </Accordion>
            <Divider hidden/>
            <Button type="submit" disabled={isSubmitting} primary>
                {id ? "Update" : "Create"}
            </Button>
        </Form>
    );
};

export const DEPProfileForm = withFormik<IDEPProfileFormProps, IDEPProfileFormValues>({
    mapPropsToValues: (props) => {
        return props.data || initialValues;
    },

    validationSchema: Yup.object().shape({
        profile_name: Yup.string().required("Required"),
    }),

    handleSubmit: (values, formikBag: FormikBag<IDEPProfileFormProps, IDEPProfileFormValues>) => {
        formikBag.props.onSubmit(values);
        formikBag.setSubmitting(false);
    },
    enableReinitialize: true,
    displayName: 'DEPProfileForm',
})(InnerForm);
