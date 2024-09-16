# Eridian.xyz

This is the source code for the [Eridian.xyz](https://eridian.xyz) website. The site is a Next.js static site.

## Development

This project includes a Bash script [build_all_commits.sh](/dev/build_all_commits.sh) that builds the static site for every commit in the git history where visible content was changed, ignoring commits that start with 'DEV'. The generated static sites are saved in folders named with the corresponding commit hash. This script is useful for testing the static site for every commit in the git history.

1. If there are any uncommitted changes, the script stashes them.
2. The script retrieves a list of all commit hashes where visible content was changed, excluding commits that start with 'DEV'.
3. The current branch name is saved.
4. The script iterates through each commit hash and performs the following steps:
    - Checks if the folder for this commit already exists. If it does, the script skips to the next commit.
    - Checks out the commit.
    - Installs dependencies specific to this commit using Yarn (if a package.json file is present).
    - Builds the static site using `yarn build && yarn next export`.
    - Moves the generated static site to a folder named with the commit hash in the versions directory.
    - Cleans up the 'out' directory.
    - Updates the static asset URLs by running an embedded Node.js script.
5. Returns to the original branch.
6. Re-installs dependencies for the original branch using Yarn (if a package.json file is present).
7. If there were changes stashed at the beginning, the script pops the stash.

When the development server is started, the previous versions are selectable in a drawer on the right side of the screen.

### Development Setup Explained

The following files and changes are required to set up a development environment for this project.

- The component [/src/components/VersionDrawer.tsx](/src/components/VersionDrawer.tsx) displays the previous versions in a drawer on the right side of the screen.

- The file [/src/components/App.tsx](/src/components/App.tsx) imports the drawer component.
```typescript
import VersionDrawer from "./VersionDrawer"

// ... (other code)
    return (
        <Container maxW="100%">
            {process.env.NODE_ENV === "development" && <VersionDrawer windowSize={windowSize} />}
            // ... (other code)
        </Container>
    )
```

- An API route [/src/pages/api/commits.ts](/src/pages/api/commits.ts) retrieves all the previous commits.

- A [server.js](/server.js) file serves the static sites for the previous commits.

- A bash script [/dev/build_all_commits.sh](/dev/build_all_commits.sh) performs the builds and file modifications.

- The [package.json](/package.json) file contains the following scripts:
```json
  "scripts": {
    "commits": "./dev/build_all_commits.sh",
    "dev": "node server.js",
    "dev-commits": "./dev/build_all_commits.sh && node server.js",
    // ... (other scripts)
```


### Development Commands

This section explains the available scripts in the `package.json` file and their usage during development.

- `yarn commits`<br/>
This command runs the [build_all_commits.sh](/dev/build_all_commits.sh) script. It builds the static site for every commit in the git history, excluding commits that start with 'DEV', and saves the generated static sites in the `versions` directory with their corresponding commit hash as the folder name. This script is useful for testing the static site for every commit in the git history.

- `yarn dev`<br/>
This command starts the development server using the `node server.js` script. Use this command during development to see live updates as you make changes to the project.

- `yarn dev-commits`<br/>
This command is a combination of the `yarn commits` and `yarn dev` commands. It first runs the `yarn commits` command to build the static site for every commit in the git history, excluding commits that start with 'DEV', and saves the generated static sites in the `versions` directory with their corresponding commit hash as the folder name. Then it runs the `yarn dev` command to start the development server. Use this command during development to see live updates as you make changes to the project.

- `yarn lint`<br/>
This command checks the code quality and adherence to coding standards using the `next lint` command. It is recommended to run this command before committing changes to ensure code consistency and maintainability.

## Production

### Production Commands

This section explains the available scripts in the `package.json` file and their usage during production deployments.

- `yarn build`<br/>
This command builds the static site for production using the `next build` command. It generates an optimized build of the site that is suitable for deployment.

- `yarn export`<br/>
This command exports the static site for production using the `next export` command. It generates an optimized build of the site that is suitable for deployment. The exported site is saved in the `out` directory.

- `yarn start`<br/>
This command first runs `yarn build` to generate an optimized build of the site and then starts the production server using the `next start` command. Use this command to test the site in a production-like environment locally.

## License

[MIT](https://choosealicense.com/licenses/mit/)
