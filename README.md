# API AUTOMATION SUITE

## About
This is an Mocha API automation framework designed to automate API Requests and perform API Chaining using Axios, AXIOS on the other hand, is a promise-based HTTP client for making HTTP requests in JavaScript. It's often used for making API requests, both in browser-based and server-side JavaScript applications..

## Setup
To use this automation framework, you will need the following:
- Node.js version 14 or higher.
- npm package manager.

## To set up the framework, follow these steps:

- Clone the repository to your local machine.

`git clone https://gitlab.unboxrobotics.com/unbox_robotics/sort-system/v3/api-test-automation-suite.git`

## After Cloning the project run the below commands to install dependencies run the test scripts
- Install the required dependencies using `npm install`.
- Run the tests using the command `npm run test` to run all the test scripts and generate Mochaawesome Report.
- Run the tests using the command `npm run test_OC_Put_Scan_Blank_run`to run the order_consolidation_put and scan Blank run projects 
- Run the tests using the command `npm run test_OC_Put_Scan_Dummy_run`to run the order_consolidation_put and scan Dummy_run projects 
- Run the tests using the command `npm run test_OC_Put_Scan_Live_run`to run the order_consolidation_put and scan Live_run projects 
- Run the tests using the command `npm run test_OC_Scan_Put_Blank_run`to run the order_consolidation_scan and put Blank run projects 
- Run the tests using the command `npm run test_OC_Scan_Put_Dummy_run`to run the order_consolidation_scan and put Dummy_run projects 
- Run the tests using the command `npm run test_OC_Scan_Put_Live_run`to run the order_consolidation_scan and put Live_run projects 
- Run the tests using the command `npm run test_PS_Put_Scan_Blank_run`to run the Parcel_sorting_put and scan Blank run projects 
- Run the tests using the command `npm run test_PS_Put_Scan_Dummy_run`to run the Parcel_sorting_put and scan Dummy_run projects 
- Run the tests using the command `npm run test_PS_Put_Scan_Live_run`to run the Parcel_sorting_put and scan Live_run projects 
- Run the tests using the command `npm run test_PS_Scan_Put_Blank_run`to run the Parcel_sorting_put and put Blank run projects 
- Run the tests using the command `npm run test_PS_Scan_Put_Dummy_run`to run the Parcel_sorting_put and put Dummy_run projects 
- Run the tests using the command `npm run test_PS_Scan_Put_Live_run`to run the Parcel_sorting_put and put Live_run projects 
- Run `npx mocha ./path/to/testScripts --timeouts 15000 --exit` to run a particular Test script.
- `describe.only` | `it.only` can be added to a particular describe or it block followed by `npm run test` in command line triggers that particular test script along with generation of Mochaawesome report.
- Run a particular suite `npm run suitename` Example `npm run rejections_api` this command would trigger all the test scripts under that particular suite. In the above example command would trigger all the test scripts under rejections folder.
- Note to get a report for a single test script execution run `npx mocha ./path/to/testScripts --timeouts 15000 --reporter mochawesome --require mochawesome/register --reporter-options code=false,reportDir=./reports/,reportFilename=API_Test_Report,reportPageTitle=API_Execution_Report,reportTitle=Execution_Report,charts=true,cdn=true --exit`

## Steps to view the report locally
- Once after the execution is completed in you local system single mouse left click on `reports` folder and then double mouse left click on the `API_Test_Report.html` to view the reports make sure you have a browser to view the reports.

## Usage

The framework includes a set of helper functions and utilities to simplify common testing tasks, making easier to write test scripts.

end_Points folder contains files which has Api endpoints that is stored in the form of object
We can use this end points in the scripts by using below command 
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
Here (../../../ )may vary on location of the test script present 

Node_modules folder contains all the libraries which is used in automation framework

Payload folder contains files which has API request payloads that is stored in the form of Object as shown below
We can use this end points in the scripts by using below command 
const payloadData = require('../../../../../../payloadData/ecsRequestPayload.data')
Here (../../../ )may vary on location of the test script present

Rejections In this folder we have all the rejection scripts that are written in the rejections.js file 

Reports  Once after the execution is completed in your local system single mouse left click on`reports` folder and then double mouse left click on the `API_Test_Report.html` to view the reports make sure you have a browser to view the reports.

Schema validation here in this folder we have written code for schema validation for shipment api

Test folder contains spec folder inside we have the actual test cases are written 
test
  -specs
    -Order_consolidation
         -Put_and_scan
            -Blank_run
            -Dummy_run
            -Live_run
         -Scan_and_put
            -Blank_run
            -Dummy_run
            -Live_run
    -Parcel_sorting
         -Put_and_scan
            -Blank_run
            -Dummy_run
            -Live_run
         -Scan_and_put
            -Blank_run
            -Dummy_run
            -Live_run
Based on the project,feeding type and sortation mode test cases are written in there respective folders as shown above 

Test_data in this folder we have .csv files based on naming convention

Utility folder here we have some of the utilities files that can be reused

apiUtility.js file has function to make http CRUD operations like POST GET, UPDATE, DELETE

convert_to_junit_XML.js has function which convert junit to XML 

csvUtility.js has function fetching data from csv file by different actions as follows
getDataInCSVByColumnHeader
writeDataToCSV
getDataInCSVByRowNumberAndColumnHeaders
getAllTheDataFromCSVByColumnHeaders
getDataInCSVByRowNameAndColumnHeaders

dbUtility.js has function fetching data from DataBase as follows
configureClientDetails
executeQueryInDatabase
disconnectDataBaseConnection

genericConfig.js has function which are reused multiple times in the framework 
activateSystemMode
activateSortationMode
activateStation
uploadSKUDetails
uploadShipmentDetails
updateAllBinStatus
generateItemBarcode
generateUUID
changeAllBinStatus
changeSingleBinStatus
configureParcelSortationEnvironment
configureParcelSortationEnvironmentDummyrun
executeResetParcelCache

Stringutility.js has function which are reused multiple times in the framework
replaceData
stringToJsonObject
concatenateStrings
replaceMultiple
jsonObjectToString

.env file here we write all the Staging urls,ports,database connects,station details as 

.eslintrc this file has  ESLint is a static code analysis tool for identifying problematic patterns found in JavaScript code.

.gitlab-ci.yml file has code for configuration of GitLab CICD pipeline
here in this file we need to specify the project to executed in CICD pipeline 
under test_job,in scripts as shown below `npm run test_PS_Scan_Put_Live_run`
`test_job:
  image: $CONTAINER_TEST_IMAGE
  stage: test
  script:
    - chmod -R a+x node_modules
    - npm run test_PS_Scan_Put_Live_run  // This statement will vary based on the project to be executed in pipeline
`

babel.config.js  Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments.Here node version will be mentioned 

Dockerfile : This file is used to run the code by creating docker image 

jsconfig. json : The presence of jsconfig. json file in a directory indicates that the directory is the root of a JavaScript Project. The jsconfig. json file specifies the root files and the options for the features provided by the JavaScript language service

package.json : This file will have all the dependencies used in project under dev-dependencies 
under scripts : We will have shortcuts to run the scripts by specifiying npm command with relative path


## Roadmap

## Contributing

## Authors and acknowledgment

## Project status
