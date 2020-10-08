# het-frontend

The frontend codebase for [Health Equity Tracker](https://healthequitytracker.org/).

## Developer Instructions 

Code in the `app/` directory was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). In that directory you can run various `npm` scripts, which are described below.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

_Note: The following instructions assume running all commands from the `app/` directory._

### Install

Change directories to the `app/` directory, then install dependencies using NPM.  

_Note: you will need a compatible verison of Node.JS and NPM installed locally. See the "engines" field in `app/package.json` for the required / minimum versions of each. It's recommended to use [Node Version Manager (`nvm`)](https://github.com/nvm-sh/nvm) if you need to have multiple versions of Node.JS / NPM installed on your machine._

```bash
cd app && npm install
```

### Develop

To run the app in development mode, start a local web server, and watch for changes do:

```bash
npm start
```

The site should now be visible at `localhost:3000`. Any changes to source code will cause a live reload of the site.

### Tests

To run unit tests do:

```bash
npm test
```

This will run tests in watch mode, so you may have the tests running while developing.

### Build

To create a "production" build do:

```bash
npm run build
```

This should output bundled files in the `app/build/` directory. Use these files for hosting the web app.

### Ejecting Create React App

_Note: this is a one-way operation. Once you `eject`, you can’t go back!_

If you aren’t satisfied with the Create React App build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## License

[MIT](./LICENSE)