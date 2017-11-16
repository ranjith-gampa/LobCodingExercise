# LobCodingExercise
This Project demonstrates how to create a letter using Lob API


# Requirements
1. node.js - This can be installed form http://nodejs.org/ or using HomeBrew for mac -> brew install node
2. JSON file for from-address data. File format
    {
    
      "name": "Joe Schmoe",

      "address_line1": "2096 S 24th St",

      "address_line2": "Suite 456",

      "address_city": "San Jose",

      "address_state": "CA",

      "address_country": "US",

      "address_zip": "95112",

      "message": "This is a test letter for Lob’s coding challenge. Thank you legislator."
    
    }


# Steps to run
1. Download the project and go to the project folder using command prompt
2. Open command prompt and run the following command
        npm app.js [file-path] (E.g., node app.js /users/user/desktop/filename.js
3. This opens a web page, then click on the "send letter" button which creates a letter object using Lob API
4. Link to the pdf-file of the letter is printed on command prompt
5. Use Ctrl+C to termiate the node server to re-run program


