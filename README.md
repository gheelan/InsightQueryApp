# InsightQueryApp
University of British Columbia Software Development MicroMasters Capstone Project

This is the capstone project for the University of British Columbia's Software Development MicroMasters Program. The goal of the project is to create a query engine that can handle queries on real data on courses and buildings from the University of British Columbia (UBC). This is a full stack web development project divided into four sprints. The focus of the first three sprints is to create a test suite and build the back end of the query engine, the fourth and final sprint is focused on creating a web server and connecting the back end functionality to the web server, and a frontend UI. In the first sprint, I followed a TDD approach by building a comprehensive Integration test suite using Black Box Testing within the InsightFacade.spec.ts file. In the second sprint, I implemented functionality that would allow users to perform queries on datasets pertaining to courses at UBC, add/remove datasets, and view information about datasets that have been uploaded (see below for details). In the third sprint, I extended the functionality of the application to perform queries on datasets pertaining to buildings on the UBC campus. In addition, I added the ability for the aggregate queries to be run on course or building datasets which allow users to create unique groupings from a query result and then obtain information about the groupings (i.e. group a query result by unique departments and then find the average grade of courses taught by that department). In the fourth sprint, I implemented REST endpoints for a web server built with the Restify framework and implemented functionality in the frontend that allows for queries to be built from an intuitive UI.

Examples of functionality written in the second sprint:
  * Process and validate thousands of CSV files from zip files into an internal data structure that can be used to perform queries
  * Allowed user to view information on datasets such as how many rows are contained within
  * Working with an EBNF, wrote methods to validate that queries adhered to specific grammar/syntax rules
  * Perform complex queries that return meaningful data to the user
    - (Ex. In courses dataset courses, find entries whose Average is greater than 90 and Department is "adhe" or Average is equal to 95; show Department, ID and Average; sort in         ascending order by Average.)
  * Created unit tests for classes and methods using the Mocha test framework

Examples of functionality written in the third sprint:
  * Process XML files containing information on buildings at UBC and their rooms into an internal data structure that can be used to perform queries
  * Utilized an API to attain geolocation data of buildings in a dataset and create corresponding latitude and longitude attributes for the dataset
  * Added the ability to perform queries on building/room data
    - (Ex. In rooms dataset rooms, find entries whose Short Name includes "ESB" and Seats is greater than 100; show Short Name, Number and Seats; sort in descending order by             Seats, Short Name, and Number.)
  * Wrote a MergeSort algorithm that allows for queries to be sorted using multiple attributes
  * Perform aggregate queries on room and course datasets that can return the average, sum, minimum, and maximum values of groups specified by the user
    - (Ex. Find and group all courses taught by a specific professor and then return the average number of students who passed their courses as well as the minimum average grade       from all of their courses)
 
Examples of functionality written in the fourth sprint:
  * Created PUT, POST, GET, and DELETE REST endpoints that allow for the main functionality of the application to be accessed from the frontend
  * Used JavaScript to access the HTML DOM of the UI to convert user inputs into a query that could be used by the backend query engine
  * Implemented AJAX calls that allowed the frontend to send query information to the backend engine
  * Used the Karma testing framework to test frontend functionality
