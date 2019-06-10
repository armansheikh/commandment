import * as React from "react";

import {
    Breadcrumb,
    List,
    Container,
    Divider,
    Header,
} from "semantic-ui-react";


import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {MASResult} from "../components/itunes/MASResult";
import {SearchInput} from "../components/SearchInput";
import {RootState} from "../reducers";
import {
    itunesSearch,
    ItunesSearchAction,
    post,
    PostActionRequest,
    postAppStoreIos,
    postAppStoreMac,
} from "../store/applications/actions";
import {
    ArtworkIconSize,
    EntityType,
    IiTunesSearchResult,
    IiTunesSoftwareSearchResult,
    MediaType,
} from "../store/applications/itunes";

import {Link} from "react-router-dom";
import {Application} from "../store/applications/types";

interface IRouteProps {
    entity: EntityType;
}

export interface IDispatchProps {
    itunesSearch: ItunesSearchAction;
    post: PostActionRequest;
    postAppStoreMac: PostActionRequest;
    postAppStoreIos: PostActionRequest;
}

export interface IStateProps {
    storeCountry: string;
    loading: boolean;
    itunesSearchResult: IiTunesSearchResult;
    itunesStoreIdsAdded: number[];
}

export type AppStorePageProps = IDispatchProps & IStateProps & RouteComponentProps<IRouteProps>;

export class UnconnectedAppStorePage extends React.Component<AppStorePageProps, any> {
    public render() {
        const { itunesSearchResult, itunesStoreIdsAdded, loading, match: { params: { entity }}} = this.props;

        return (
            <Container>
                <Divider hidden/>
                <Breadcrumb>
                    <Breadcrumb.Section><Link to={`/`}>Home</Link></Breadcrumb.Section>
                    <Breadcrumb.Divider />
                    <Breadcrumb.Section><Link to={`/applications`}>Applications</Link></Breadcrumb.Section>
                    <Breadcrumb.Divider />
                    <Breadcrumb.Section>Find a {entity === "macSoftware" ? "macOS" : "iOS"} app</Breadcrumb.Section>
                </Breadcrumb>
                <Divider hidden/>
                <Header as="h1">Find a new {entity === "macSoftware" ? "macOS" : "iOS"} App Store App
                    <Header.Subheader>Add an App Store app as a managed application.</Header.Subheader>
                </Header>

                <SearchInput duration={400} loading={loading} onSearch={this.handleSearch}/>

                {itunesSearchResult &&
                    <div>
                      <p>Your search returned <strong>{itunesSearchResult.resultCount}</strong> result(s)</p>
                    <List relaxed="very">
                        {itunesSearchResult.results.map((result: IiTunesSoftwareSearchResult) => (
                            <MASResult key={result.trackId}
                                       data={result}
                                       icon={ArtworkIconSize.Sixty}
                                       onClickAdd={this.handleClickAdd}
                                       isAdded={itunesStoreIdsAdded.indexOf(result.trackId) !== -1}
                            />
                        ))}
                    </List>
                    </div>
                }
            </Container>
        );
    }

    private handleClickAdd = (result: IiTunesSoftwareSearchResult) => {
        const entity = this.props.match.params.entity;
        const app: Application = {
            bundle_id: result.bundleId,
            description: result.description,
            display_name: result.trackName,
            itunes_store_id: result.trackId,
            version: result.version,

            country: this.props.storeCountry,

            artist_id: result.artistId,
            artist_name: result.artistName,
            artist_view_url: result.artistViewUrl,
            artwork_url60: result.artworkUrl60,
            artwork_url100: result.artworkUrl100,
            artwork_url512: result.artworkUrl512,
            release_notes: result.releaseNotes,
            release_date: result.releaseDate,
            minimum_os_version: result.minimumOsVersion,
            file_size_bytes: result.fileSizeBytes,
        };

        if (entity === EntityType.macSoftware) {
            this.props.postAppStoreMac(app)
        } else if (entity === EntityType.software) {
            this.props.postAppStoreIos(app);
        } else {
            // cant really post this
        }

    };

    private handleSearch = (value: string) => {
        const { match: { params: { entity }}, storeCountry} = this.props;
        this.props.itunesSearch(value, storeCountry, MediaType.software, entity);
    };
}

export const AppStorePage = connect(
    (state: RootState, ownProps?: any) => ({
        itunesSearchResult: state.applications.itunesSearchResult,
        itunesStoreIdsAdded: state.applications.itunesStoreIdsAdded,
        loading: state.applications.itunesSearchResultLoading,
        storeCountry: state.applications.storeCountry,
    }),
    (dispatch: Dispatch, ownProps?: any) => bindActionCreators({
        itunesSearch,
        post,
        postAppStoreIos,
        postAppStoreMac,
    }, dispatch),
)(UnconnectedAppStorePage);
