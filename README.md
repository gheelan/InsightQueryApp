# InsightQueryApp
University of British Columbia Software Development MicroMasters Capstone Project

edx/UBC Capstone Project

This is the capstone project for the University of British Columbia's Software Development MicroMasters Program. The goal of the project is to create a query engine that can handle queries on real data from courses and buildings from the University of British Columbia (UBC). This is a full stack web development project divided into four sprints. The focus of the first three sprints is to create a test suite and build the back end of the query engine, the fourth and final sprint is focused on creating a web server and connecting the back end functionality to the web server and a frontend UI. This is a project I am actively working on. Currently, I have completed three of the four sprints. In the first sprint, I followed a TDD approach in order to build a comprehensive Integration test suite using Black Box Testing within the InsightFacade.spec.ts file. In the second sprint, I created numerous unit tests and wrote functionality that would allow users to perform queries on datasets pertaining to courses (see below for details). In the third sprint, I extended the functionality of the application to perform queries on datasets pertaining to buildings on the UBC campus. In addition, I added the ability for the aggregate queries to be run on course or building datasets which allow users to create unique groupings from a query result and then obtain information about the groupings (i.e. group a query result by unique departments and then find the average grade of courses taught by that department).

Examples of functionality written in the second sprint:
  * Process and validate thousands of CSV files into an internal data structure that can be used to perform queries
  * Working with an EBNF, wrote methods to validate that queries adhered to specific grammar/syntax rules
  * Perform complex queries that return meaningful data to the user
    - (Ex. In courses dataset courses, find entries whose Average is greater than 90 and Department is "adhe" or Average is equal to 95; show Department, ID and Average; sort in         ascending order by Average.)
  * Created multiple unit tests for classes and methods using the Mocha test framework

Examples of functionality written in the third sprint:
  * Process XML files containing information on buildings at UBC and their rooms into an internal data structure that can be used to perform queries
  * Added the ability to perform queries on building/room data
    - (Ex. In rooms dataset rooms, find entries whose Short Name includes "ESB" and Seats is greater than 100; show Short Name, Number and Seats; sort in descending order by             Seats, Short Name, and Number.)
  * Wrote a MergeSort algorithm that allows for queries to be sorted using multiple attributes
  * Perform aggregate queries on room and course datasets that can return the average, sum, minimum, and maximum values of groups specified by the user
    - (Ex. Find and group all courses taught by a specific professor and then return the average number of students who passed their courses and the minimum average grade from         all of their courses)
 
 I am currently beginning work on the fourth and final sprint in which I will create a web server and connect the backend query engine to a boilerplate UI implementation!
