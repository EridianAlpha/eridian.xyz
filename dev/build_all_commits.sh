#!/bin/bash

# This bash script builds the static site for every commit in the git history
# and saves the generated static site in a folder named with the commit hash.
# This script is useful for testing the static site for every commit in the
# git history.

# Store any uncommitted changes
git add .

# Get a list of all commit hashes
# Exclude commits that start with 'DEV' (these are commits that were only
# impact the development environment and do not need to be built)
commits=$(git log --pretty=format:'%h' --invert-grep --grep='^DEV')

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

    # Build the static site
    yarn build && yarn next export

    # Move the generated static site to a folder named with the commit hash
    mkdir -p "versions/$commit"
    mv out/* "versions/$commit"

    # Clean up the 'out' directory
    rm -rf out
  fi
done

# Return to the original branch
git checkout --force $current_branch

# Re-install dependencies for the original branch
if [ -f "package.json" ]; then
  yarn install
fi

# Update static asset URLs
node dev/update_assets.js $commit out
