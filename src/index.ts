import "reflect-metadata"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Arg, buildSchema, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

@ObjectType()
class Book {
    @Field()
    id: string
    @Field()
    title: string
    @Field()
    author: string
}
const books: Book[] = [
  {
    id: '0',
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: '1',
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

@InputType()
class BookInput {
    @Field()
    title: string

    @Field()
    author: string
}

@Resolver(Book)
class BookResolver {
    @Query(() => [Book])
    books(){
        return books
    }

    @Query(() => Book)
    getBookById(@Arg("id") id: String) {
        return books.find((book) => book.id == id)
    }

    @Mutation(() => Book)
    addBook(@Arg("data") {title, author} : BookInput) {
         const lastId = parseInt(books.at(-1).id,10)
            const id = (lastId + 1).toString()
            books.push({
                title, author, id,
            })
            return books.at(-1)
    }
}

const schema = await buildSchema({
    resolvers: [BookResolver],
})

const server = new ApolloServer({schema})


/********** Before using types from our types TS *******/
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// const typeDefs = `#graphql
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     id: ID
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//     getBookById(bookId: ID) : Book
//   }

//   type Mutation {
//     addBook(title: String, author: String): Book
//   }
// `;

// const resolvers = {    
//     Query: {
//         books: () => books,
//         getBookById: (_, args) => books.find((book) => book.id == args.bookId)
//     },
//     Mutation: {
//         addBook: (_, args) => {
//             const lastId = parseInt(books.at(-1).id,10)
//             const id = (lastId + 1).toString()
//             books.push({
//                 title: args.title,
//                 author: args.author,
//                 id: id,
//             })
//             return books.at(-1)
//         },
//     }
// }

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);