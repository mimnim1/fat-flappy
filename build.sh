rm -r -f docs
mkdir docs
mkdir docs/scripts
cp -R public/* docs/
./node_modules/.bin/webpack
