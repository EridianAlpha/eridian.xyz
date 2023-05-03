#!/bin/bash

# This bash script builds the static site for every commit in the git history
# and saves the generated static site in a folder named with the commit hash.
# This script is useful for testing the static site for every commit in the
# git history.

# Check if there are any changes to stash
stash_needed=$(git diff-index --quiet HEAD -- || echo "yes")

# Store any uncommitted changes
if [ "$stash_needed" == "yes" ]; then
  git stash
fi

# Get a list of all commit hashes
# Exclude commits that start with 'DEV' (these are commits that were only
# impact the development environment and do not need to be built)
# Only include the 'public' folder, 'src' folder, and 'theme.ts' file
commits=$(git log --pretty=format:'%h' --invert-grep --grep='^DEV' -- public src theme.ts)

# Save the current branch name
current_branch=$(git symbolic-ref --short HEAD)

# Iterate through each commit hash
for commit in $commits; do
  # Check if the folder for this commit already exists
  if [ ! -d "versions/$commit" ]; then
    echo "Checking out commit: $commit"

    # Checkout the commit
    git checkout --force $commit

    # Install dependencies specific to this commit
    if [ -f "package.json" ]; then
      # Install dependencies specific to this commit
      yarn install
    fi

    # Replace the condition in App.tsx file to include VersionDrawer in production build
    sed -i "s/{process.env.NODE_ENV === \"development\" && <VersionDrawer windowSize={windowSize} />}/{true && <VersionDrawer windowSize={windowSize} />}/g" src/components/App.tsx

    # The API route is also different to get to the versions folder in the built version

    # The API itself has a condition to check if the NODE_ENV is production, which also needs to be removed


    # Build the static site
    yarn build && yarn next export

    # Move the generated static site to a folder named with the commit hash
    mkdir -p "versions/$commit"
    mv out/* "versions/$commit"

    # Clean up the 'out' directory
    rm -rf out

    # Update static asset URLs
    # It's easier to have this an an embedded Node.js script
    # rather than a separate file, otherwise, that other file might be a different version
    # in the branch that it's reading from
    node -e "$(cat << 'EOF'
const fs = require("fs")
const path = require("path")
const commit = process.argv[1]

const updateAssets = (commit) => {
  const basePath = path.join(process.cwd(), "versions", commit)
  const files = fs.readdirSync(basePath)

  files.forEach((file) => {
    if (file.endsWith(".html")) {
      const filePath = path.join(basePath, file)
      let content = fs.readFileSync(filePath, "utf-8")

      content = content.replace(/\/_next\//g, `/${commit}/_next/`)

      fs.writeFileSync(filePath, content)
    }
  })
}

updateAssets(commit)
EOF
    )" $commit
  fi
done

# Return to the original branch
git checkout --force $current_branch

# Re-install dependencies for the original branch
if [ -f "package.json" ]; then
  yarn install
fi

# Pop the stash if there were changes to stash
if [ "$stash_needed" == "yes" ]; then
  git stash pop > /dev/null 2>&1
fi
