rm -r -f docs
mkdir docs
mkdir docs/scripts
cp -R public/* docs/
browserify ./src/main.js -o docs/scripts/bundle.js
