# Common

Holds common stuff to be used by the microservices

## Publish

`npm run pub '<COMMIT-MESSAGE>'` (don't forget the `'` )

## Inc version

`npm version patch`

## If this is published to a private repo...

Don't forget to add a .npmrc to the services that will be pulling this pkg. 
And make sure it's being copied by your Dockerfile statements.

**Ex of .npmrc with gitlab private pkg registry**

Here, "react-node-microservices-course" is a group, containing the project.

```
@react-node-microservices-course:registry=https://gitlab.com/api/v4/projects/<projectID>/packages/npm/

//gitlab.com/api/v4/projects/<projectID>/packages/npm/:_authToken=<PERSONAL_TOKEN>
```