# InsightQueryApp
University of British Columbia Software Development MicroMasters Capstone Project

edx/UBC Capstone Project

This is the capstone project for the University of British Columbia's Software Development MicroMasters Program.The goal of the project is to create a query engine that canhandle queries on real data from courses and buildings from the University of British Columbia (UBC). This is a full stack web development project divided into four sprints. The focus of the first three sprints is to create a test suite and build the back end of the query engine, the fourth and final sprint is focused on building the front end of the application. This is a project I am actively working on. Currently, I have completed two of the four sprints. In the first sprint, I followed a TDD approach in order to build a comprehensive Integration test suite using Black Box Testing within the InsightFacade.spec.ts file. In addition, I created numerous unit tests for all of the classes currently being utilized in the application. In the second sprint, I completed the back end for the part of the query engine that specifically handles queries on course data.

Some specific examples of functionality that was written in the second sprint:
  * Process and validate thousands of csv files into an internal data structure that can be used to perform queries
  * Working with an EBNF, wrote methods to validate that queries adhered to specific grammar/syntax rules
  * Perform complex queries that return meaningful data to the user
    - (Ex. In courses dataset courses, find entries whose Average is greater than 90 and Department is "adhe" or Average is equal to 95; show Department, ID and Average; sort in         ascending order by Average.)
  * Created multiple unit tests for classes and methods using the Mocha test framework

I am finishing up the third sprint and have successfully implemented the following functionality:

  * Process XML files containing information on buildings at UBC and their rooms into an internal data structure that can be used to perform queries
  * Added the ability to perform queries on building/room data
    - (Ex. In rooms dataset rooms, find entries whose Short Name includes "ESB" and Seats is greater than 100; show Short Name, Number and Seats; sort in descending order by             Seats, Short Name, and Number.)
  * Wrote a MergeSort algorithm that sorts query results using multiple attributes
  * Perform aggregate queries on room and course datasets that can return the average, sum, minimum, and maximum values of groups specified by the user
    - (Ex. Find and group all courses taught by a specific professor and then return the average number of students who passed their courses and the minimum average grade from all       of their courses)
    
I am currently working on adjusting the MergeSort algorithm to work for aggregate course and building query results; once this step has been completed I will be ready to move on to the fourth and final sprint of the project in which I will work towards connecting the backend to a web server and frontend UI in order to deploy it as a web application!
