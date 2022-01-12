# AC Shopify 2022 Build

## Repo URL
https://github.com/ambercouch/AC-Shopify-2022-Build

## Current Master Branch

**ACS-master**
https://github.com/ambercouch/AC-Shopify-2022-Build/tree/ACS-master

This Repo works in conjunction with the [AC Shopify 2022 Theme repo](https://github.com/ambercouch/AC-Shopify-2022-Theme) which is a submodule in the dist folder. The dist folder can automaticaly be synced with any Shopify store theme when commits are made.

## Installation

```
git clone --recurse-submodules --remote-submodules https://github.com/ambercouch/AC-Shopify-2022-Build your-folder
cd your-folder
git checkout ACS-master
git submodule init 
git submodule update
npm install
cp gulpfile.example.js gulpfile.js
gulp
```
