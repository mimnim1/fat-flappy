rm -r -f dist
mkdir dist
mkdir dist/scripts
cp -R public/* dist/
browserify ./src/main.js -o dist/scripts/bundle.js
