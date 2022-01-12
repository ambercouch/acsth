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
   
   Currently the default gulp command will watch the /src folder and compile any changes to .js, .scss, .liquid and .svg files the /dist folder.
   
   The default gulp command will **not** preview or sync any changes with Shopify. To sync your changes with your Shopify site use [Shopify github integration](https://shopify.dev/themes/tools/github) from with in your store or use the [Shopify cli tool](https://shopify.dev/themes/tools/cli) form within the dist folder to create a preview.
