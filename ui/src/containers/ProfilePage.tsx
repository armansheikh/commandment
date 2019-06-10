import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {RootState} from "../reducers/index";

import {Container, Header, Breadcrumb, Divider} from "semantic-ui-react";
import { DropdownProps } from "semantic-ui-react";

import {SyntheticEvent} from "react";
import {RouteComponentProps} from "react-router";
import {TagDropdown} from "../components/TagDropdown";
import {isArray} from "../guards";
import {JSONAPIDataObject, JSONAPIRelationship} from "../store/json-api";
import {patchRelationship, PatchRelationshipActionRequest} from "../store/profiles/actions";
import {read, ReadActionRequest} from "../store/profiles/actions";
import {Profile} from "../store/profiles/types";
import {
    index as fetchTags, IndexActionRequest,
    post as createTag, PostActionRequest as PostTagActionRequest,
} from "../store/tags/actions";
import {ITagsState} from "../store/tags/reducer";
import {Tag} from "../store/tags/types";

import {Link} from "react-router-dom";
import {ResourceIdentifier} from "../json-api-v1";

interface IRouteProps {
    id?: string;
}

interface IReduxStateProps {
    profile?: JSONAPIDataObject<Profile>;
    tags: ITagsState;
}

function mapStateToProps(state: RootState, ownProps?: any): IReduxStateProps {
    return {
        profile: state.profile.profile,
        tags: state.tags,
    };
}

interface IReduxDispatchProps {
    read: ReadActionRequest;
    fetchTags: IndexActionRequest;
    createTag: PostTagActionRequest;
    patchRelationship: PatchRelationshipActionRequest;
}

function mapDispatchToProps(dispatch: Dispatch): IReduxDispatchProps {
    return bindActionCreators({
        createTag,
        fetchTags,
        patchRelationship,
        read,
    }, dispatch);
}

export class UnconnectedProfilePage extends React.Component<RouteComponentProps<IRouteProps> & IReduxStateProps & IReduxDispatchProps, void | {}> {

    public componentWillMount?() {
        const {params: {id}} = this.props.match;
        this.props.read(id, ["tags"]);
        this.props.fetchTags();
    }

    public render() {
        const {
            profile,
            tags,
        } = this.props;

        let profileTags: number[] = [];
        if (profile && profile.relationships && profile.relationships.tags) {
            if (isArray(profile.relationships.tags.data)) {
                profileTags = profile.relationships.tags.data.map((t: ResourceIdentifier) => parseInt(t.id, 0));
            }

        }

        return (
            <Container className="ProfilePage">
                <Divider hidden />
                <Breadcrumb>
                    <Breadcrumb.Section><Link to={`/`}>Home</Link></Breadcrumb.Section>
                    <Breadcrumb.Divider />
                    <Breadcrumb.Section><Link to={`/profiles`}>Profiles</Link></Breadcrumb.Section>
                    <Breadcrumb.Divider />
                    <Breadcrumb.Section>Profile</Breadcrumb.Section>
                </Breadcrumb>

                <Header as="h1">
                    {profile && profile.attributes.display_name}
                    <Header.Subheader>{profile && profile.attributes.uuid}</Header.Subheader>
                    <Header.Subheader>{profile && profile.attributes.identifier}</Header.Subheader>
                </Header>
                <TagDropdown
                    loading={tags.loading}
                    tags={tags.items}
                    value={profileTags}
                    onAddItem={this.handleAddTag}
                    onSearch={this.handleSearchTag}
                    onChange={this.handleChangeTag}
                />

            </Container>
        );
    }

    private handleAddTag = (event: SyntheticEvent<MouseEvent>, {value}: { value: string }) => {
        const tag: Tag = {
            color: "888888",
            name: value,
        };

        this.props.createTag(tag);
    };

    private handleSearchTag = (value: string) => {
        this.props.fetchTags(10, 1, [], [{name: "name", op: "ilike", val: `%${value}%`}]);
    };

    private handleChangeTag = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;

        const relationships = value.map((v: string) => {
            return {id: v, type: "tags"};
        });

        this.props.patchRelationship(
            "" + this.props.match.params.id, "tags", relationships);
    };
}

export const ProfilePage = connect<IReduxStateProps, IReduxDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(UnconnectedProfilePage);
