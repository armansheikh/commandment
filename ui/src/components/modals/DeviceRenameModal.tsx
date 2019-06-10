import * as React from "react";
import {Modal, Form, FormProps, Button} from "semantic-ui-react";

import {RouteComponentProps} from "react-router-dom";
import {Device} from "../../store/device/types";
import {JSONAPIDataObject} from "../../store/json-api";

export interface IDeviceRenameModalProps extends RouteComponentProps<any> {
    device: JSONAPIDataObject<Device>;
}

export const DeviceRenameModal: React.FunctionComponent<IDeviceRenameModalProps> =
    ({ history, device }: IDeviceRenameModalProps) => (
    <Modal defaultOpen closeIcon onClose={() => {
        history.goBack();
    }}>
        <Modal.Header>Rename Device</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        <label>Current Device Name</label>
                        <input type="text" name="old_device_name" value={device.attributes.device_name} readOnly />
                    </Form.Field>
                    <Form.Field>
                        <label>New Device Name</label>
                        <input type="text" name="new_device_name" />
                    </Form.Field>
                </Form>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button type="submit" primary>
                Rename
            </Button>
        </Modal.Actions>
    </Modal>
);
