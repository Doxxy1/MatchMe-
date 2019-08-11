// Imports
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');

//Globals
const app = express();
const PORT = process.env.PORT || 3000

// In-memory dummy data
const users = [{ _id: "1", firstName: "Mohamad", lastName: "Geeleh"}, { _id: "2", firstName: "John", lastName: "Doe"}];


// Construct a schema, using GraphQL schema language
//! makes a field non-nullable
//MongoDB uses _ for id
//GraphQL has ID type (unique)
const schema = buildSchema(`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
  }
  
  input UserInput {
    firstName: String!
    lastName: String!
  }
  
  type Query {
    users: [User!]!
  }
  type Mutation {
    createUser(userInput: UserInput): User
  }
  
  schema {
    query: Query
    mutation: Mutation
    }
`);

// The root provides a resolver function for each API endpoint
const root = {
    users: () => {
        return users;
    },
    createUser: (args) => {
        const user = {
            _id: Math.random().toString(),
            firstName: args.userInput.firstName,
            lastName: args.userInput.lastName,

        }
        users.push(user);
        return user;
    }
};

//Graphql Endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

//Port listen
app.listen(PORT);
