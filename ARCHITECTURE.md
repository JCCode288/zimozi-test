# ZIMOZI TEST

## Backend

### Tech Stack

-  Database : **POSTGRESQL**
-  Framework: **NestJS - Express**
-  Auth: **Firebase Auth**

> I picked the simpler REST API for the backend to simplify the app. based on the requirements, the app itself is pretty complex and should take more time to think about the architecture and data passing. also RBAC for the app more than 3 days. So to save time i make it simpler for the connection from NextJS server side to NestJS backend

### DB Diagram

<img src="zimozi_db - public.png">
zimozi-db diagram

-  Order is took from cart
-  This database schema is hurriedly created, i knew to have missed that i need separate table for orders to process it separately. but i think in this current requirement, this will still be enough. i also make sure that it can be done later by creating mock of it in form of view table

## Frontend

### Tech Stack

-  State Management: **Zustand**
-  Framework: **NextJS**
-  Auth: **Firebase Auth**
-  Fetcher: **Axios**
-  GraphQL: **Apollo**

> GraphQL for fetching data from NextJS server side is preferred instead of BE NestJS graphql as frontend has advantage in this configuration of caching and auto refetching in GraphQL.
> Main operation still uses REST API for easier debugging.
> I uses v0 to help me create inteface and integrations to shorten time. as you can see, the code became almost unmaintainable. i need to create few queries from scratch and adjusting it again.
> I also uses zustand for state management as it was simpler to setup and have more durable and intuitive persist options. this can give nextjs more advantage for prefetching data

>

## Notes

i do think this is one of my bad work. i prioritized speed than quality and maintainability for this project. i focused on backend functionality (which i may miss some) to adjust the timeline for the main flow only (main CRUD).

## Deployment

as my vercel freebies is being used by my other projects. and google functions needed me to config for `pay-as-you-go` i opted for deploying in my old laptop (linux server)
