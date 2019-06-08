import {Dispatch} from "redux";
import {ApiError, HTTPVerb, RSAA, RSAAction} from "redux-api-middleware";
import {ThunkAction} from "redux-thunk";
import {
    JSONAPIRelationship, RSAAIndexActionRequest,
    RSAAIndexActionResponse, RSAAReadActionRequest, RSAAReadActionResponse,
} from "../json-api";
import {JSONAPIDetailResponse} from "../json-api";
import {Profile, ProfileRelationship} from "./types";
import {Tag} from "../tags/types";
import {RootState} from "../../reducers/index";
import {JSONAPI_HEADERS} from "../constants"
import {encodeJSONAPIIndexParameters, FlaskFilter, FlaskFilters} from "../../flask-rest-jsonapi";

export enum ProfilesActionTypes {
    INDEX_REQUEST = "profiles/INDEX_REQUEST",
    INDEX_SUCCESS = "profiles/INDEX_SUCCESS",
    INDEX_FAILURE = "profiles/INDEX_FAILURE",
    READ_REQUEST = "profiles/READ_REQUEST",
    READ_SUCCESS = "profiles/READ_SUCCESS",
    READ_FAILURE = "profiles/READ_FAILURE",
    REL_PATCH_REQUEST = "profiles/relationships/PATCH_REQUEST",
    REL_PATCH_SUCCESS = "profiles/relationships/PATCH_SUCCESS",
    REL_PATCH_FAILURE = "profiles/relationships/PATCH_FAILURE",
}

export type IndexActionRequest = RSAAIndexActionRequest<ProfilesActionTypes.INDEX_REQUEST, ProfilesActionTypes.INDEX_SUCCESS, ProfilesActionTypes.INDEX_FAILURE>;
export type IndexActionResponse = RSAAIndexActionResponse<ProfilesActionTypes.INDEX_REQUEST, ProfilesActionTypes.INDEX_SUCCESS, ProfilesActionTypes.INDEX_FAILURE, Profile>;

export const index = encodeJSONAPIIndexParameters((queryParameters: string[]) => {
    return ({
        [RSAA]: {
            endpoint: "/api/v1/profiles?" + queryParameters.join("&"),
            headers: (state: RootState) => ({
                ...JSONAPI_HEADERS,
                Authorization: `Bearer ${state.auth.access_token}`,
            }),
            method: ("GET" as HTTPVerb),
            types: [
                ProfilesActionTypes.INDEX_REQUEST,
                ProfilesActionTypes.INDEX_SUCCESS,
                ProfilesActionTypes.INDEX_FAILURE,
            ],
        },
    } as RSAAction<ProfilesActionTypes.INDEX_REQUEST, ProfilesActionTypes.INDEX_SUCCESS, ProfilesActionTypes.INDEX_FAILURE>);
});

export type ReadActionRequest = RSAAReadActionRequest<ProfilesActionTypes.READ_REQUEST, ProfilesActionTypes.READ_SUCCESS, ProfilesActionTypes.READ_FAILURE>;
export type ReadActionResponse = RSAAReadActionResponse<ProfilesActionTypes.READ_REQUEST, ProfilesActionTypes.READ_SUCCESS, ProfilesActionTypes.READ_FAILURE, JSONAPIDetailResponse<Profile, undefined>>;

export const read: ReadActionRequest = (id: string, include?: string[]) => {

    let inclusions = "";
    if (include && include.length) {
        inclusions = "include=" + include.join(",")
    }

    return {
        [RSAA]: {
            endpoint: `/api/v1/profiles/${id}?${inclusions}`,
            headers: (state: RootState) => ({
                ...JSONAPI_HEADERS,
                Authorization: `Bearer ${state.auth.access_token}`,
            }),
            method: "GET",
            types: [
                ProfilesActionTypes.READ_REQUEST,
                ProfilesActionTypes.READ_SUCCESS,
                ProfilesActionTypes.READ_FAILURE,
            ],
        },
    }
};

export type PatchRelationshipActionRequest = (parentId: string, relationship: ProfileRelationship, data: JSONAPIRelationship[]) => RSAAction<
    ProfilesActionTypes.REL_PATCH_REQUEST, ProfilesActionTypes.REL_PATCH_SUCCESS, ProfilesActionTypes.REL_PATCH_FAILURE>;
export type PatchRelationshipActionResponse = RSAAReadActionResponse<
    ProfilesActionTypes.REL_PATCH_REQUEST,
    ProfilesActionTypes.REL_PATCH_SUCCESS,
    ProfilesActionTypes.REL_PATCH_FAILURE,
    JSONAPIDetailResponse<Profile, Tag>>;

export const patchRelationship: PatchRelationshipActionRequest = (parentId: string, relationship: ProfileRelationship, data: JSONAPIRelationship[]) => {
    return {
        [RSAA]: {
            body: JSON.stringify({ data }),
            endpoint: `/api/v1/profiles/${parentId}/relationships/${relationship}`,
            headers: (state: RootState) => ({
                ...JSONAPI_HEADERS,
                Authorization: `Bearer ${state.auth.access_token}`,
            }),
            method: "PATCH",
            types: [
                ProfilesActionTypes.REL_PATCH_REQUEST,
                ProfilesActionTypes.REL_PATCH_SUCCESS,
                ProfilesActionTypes.REL_PATCH_FAILURE,
            ],
        },
    }
};

export const UPLOAD = "profiles/UPLOAD";
export type UPLOAD = typeof UPLOAD;

export const UPLOAD_REQUEST = "profiles/UPLOAD_REQUEST";
export type UPLOAD_REQUEST = typeof UPLOAD_REQUEST;
export const UPLOAD_SUCCESS = "profiles/UPLOAD_SUCCESS";
export type UPLOAD_SUCCESS = typeof UPLOAD_SUCCESS;
export const UPLOAD_FAILURE = "profiles/UPLOAD_FAILURE";
export type UPLOAD_FAILURE = typeof UPLOAD_FAILURE;

export type UploadActionRequest = (file: File) => ThunkAction<void, RootState, void, UploadActionResponse>;
export type UploadActionResponse = RSAAReadActionResponse<UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE, JSONAPIDetailResponse<Profile, undefined>>;

export const upload = (file: File): ThunkAction<void, RootState, void, UploadActionResponse> => (
    dispatch: Dispatch,
    getState: () => RootState,
    extraArgument: void) => {

    const data = new FormData();
    data.append("file", file);
    dispatch({
        payload: data,
        type: UPLOAD,
    });

    dispatch({
        [RSAA]: {
            body: data,
            endpoint: `/api/v1/upload/profiles`,
            method: "POST",
            types: [
                UPLOAD_REQUEST,
                UPLOAD_SUCCESS,
                UPLOAD_FAILURE,
            ],
        },
    })
};
