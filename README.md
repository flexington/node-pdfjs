This repository is for demonstration purpose only and not meant to be used in a production environment.

# 
This repository demonstrates the different behavior of PDF.js as a frontend and backend implementation.

# Install & Start
Install all dependecies: `npm i`  
Build the app `grunt build`  
Run the app `npm run debug`  
Open `http://localhost:61224/frontend` in your browser and load the PDF from the data directory.  
Open `http://localhost61224/backend` in your browser and load the PDF from the data directory.

# Expected
The expected outcome is, that the PDF is displayed euqally in the frontend and backend implementation.

# Actual
The actual outcome is, that the PDF is displayed correctly in the frontend implementation, but the backend implementation has missing characters and and the font isn't loaded correctly. Furthermore, images are not rendered correctly.

# Root Cause
In my opinion, the root cause could be
## The Canvas
The frontend implementation is based on the canvas element provided by the browser, however, the backend implementation is using the `node-canvas` package. The different implementations of the canvas component could be the reason for the different behavior.
# The Browser
Another source for this behavior could the the way how fonts are accessed. It could be that thr browser actually provides a better way to access the fonts than the backend provides.