# MyDeb Package Manager

## Running

To build and run the package manager run the following commands in the repository root directory.

```
npm install -g yarn
yarn
yarn mydeb
```

Then open http://localhost:8080/ in your browser to see the user interface.

## Development

To run development environment. Run the following commands in separate terminal windows.

```
yarn dev-backend     # start development backend
yarn dev-frontend    # start development frontend
yarn dev-styleguide  # start development styleguide
```

The development backend is missing a watcher and needs to be restarted after changes.
The development frontend and styleguide should auto-update on changes.

Some other useful command

```
yarn test      # run unit tests
yarn lint      # run quality checks
yarn prettify  # fix style issues
```
