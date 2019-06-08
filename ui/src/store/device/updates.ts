import {HTTPVerb, RSAA, RSAAction} from "redux-api-middleware";
import {
    RSAAChildIndexActionRequest,
    RSAAIndexActionResponse,
} from "../json-api";
import {AvailableOSUpdate} from "./types";
import {JSONAPI_HEADERS} from "../constants";
import {encodeJSONAPIChildIndexParameters} from "../../flask-rest-jsonapi";
import {RootState} from "../../reducers";

export const UPDATES_REQUEST = "devices/UPDATES_REQUEST";
export type UPDATES_REQUEST = typeof UPDATES_REQUEST;
export const UPDATES_SUCCESS = "devices/UPDATES_SUCCESS";
export type UPDATES_SUCCESS = typeof UPDATES_SUCCESS;
export const UPDATES_FAILURE = "devices/UPDATES_FAILURE";
export type UPDATES_FAILURE = typeof UPDATES_FAILURE;

export type AvailableOSUpdatesActionRequest = RSAAChildIndexActionRequest<UPDATES_REQUEST, UPDATES_SUCCESS, UPDATES_FAILURE>;
export type AvailableOSUpdatesActionResponse = RSAAIndexActionResponse<UPDATES_REQUEST, UPDATES_SUCCESS, UPDATES_FAILURE, AvailableOSUpdate>;

export const updates = encodeJSONAPIChildIndexParameters((deviceId: string, queryParameters: string[])  => {
    return ({
        [RSAA]: {
            endpoint: `/api/v1/devices/${deviceId}/available_os_updates?${queryParameters.join("&")}`,
            headers: (state: RootState) => ({
                ...JSONAPI_HEADERS,
                Authorization: `Bearer ${state.auth.access_token}`,
            }),
            method: ("GET" as HTTPVerb),
            types: [
                UPDATES_REQUEST, UPDATES_SUCCESS, UPDATES_FAILURE,
            ],
        },
    } as RSAAction<UPDATES_REQUEST, UPDATES_SUCCESS, UPDATES_FAILURE>);
});
