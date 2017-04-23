import React, { Component } from "react";

import { Admin, Resource } from "admin-on-rest";
import { buildApolloClient } from "aor-simple-graphql-client/lib";
import { Delete } from 'admin-on-rest/lib/mui';

import { PostList, PostEdit, PostCreate } from "./posts/PostList";
import pluralize from 'pluralize';
import gql from "graphql-tag";


import ApolloClient, { createNetworkInterface } from "apollo-client";
const networkInterface = createNetworkInterface({
  uri: "GRAPH_COOL_ENDPOINT"
});
const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id
});

const introspectionOptions = {
  includeTypes: null, // Either an array of types to include or a function which will be called with each OBJECT type discovered through introspection
  excludeTypes: null, // Either an array of types to exclude or a function which will be called with each OBJECT type discovered through introspection (`Query` and `Mutation` are excluded anyway)
  includeQueries: null, // Either an array of queries to include or a function which will be called with each query discovered through introspection
  excludeQueries: null, // Either an array of queries to exclude or a function which will be called with each query discovered through introspection
  includeMutations: null, // Either an array of mutations to include or a function which will be called with each mutation discovered through introspection
  excludeMutations: null, // Either an array of mutations to exclude or a function which will be called with each mutation discovered through introspection
  excludeFields: null, // Either an array of fields to exclude or a function which will be called with each field discovered through introspection on a specific object (more details below)

  // This contains templates for defining the queries and mutations names which will also be used as the operations names
  templates: {
    GET_LIST: resourceType => `${resourceType.name}`,
    GET_ONE: resourceType => `${resourceType.name}`,
    CREATE: resourceType => `create${resourceType.name}`,
    UPDATE: resourceType => `update${resourceType.name}`,
    DELETE: resourceType => `delete${resourceType.name}`,
  },
};

class AdminPage extends Component {
  constructor() {
    super();
    this.state = { restClient: null };
  }
  componentDidMount() {
    buildApolloClient({ client, introspection: introspectionOptions}).then(restClient =>
      this.setState({ restClient })
    );
  }

  render() {
    const { restClient } = this.state;

    if (!restClient) {
      return <div>Loading</div>;
    }

    return (
      <Admin restClient={restClient}>
        <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete}/>
      </Admin>
    );
  }
}

export default AdminPage;
