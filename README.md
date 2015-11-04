# Website Parser #

This code takes a website and json object array as input and tries to use the attributes inside each object to find related elements in the webpage even if the site structure changes moderately. The goal is to enable more robust scraping that recognizes elements by their size, shape, and location rather than position in the DOM tree.

## Requirements ##

* PhantomJS (Tested with v2.0)
* CasperJS (v1.1)

## Instructions ##
Run with the command `casperjs Nov3research.js`. Then output.txt will have the elements related to each json object in the json array.

