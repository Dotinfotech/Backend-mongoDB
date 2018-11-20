## Backend-mongoDB

Backend microservices api demo.
Essential features of login panel: User Registration , User Login, Forgot Password, Update Password; all done in Node.js with Express and MongoDB.

**User Authentication** enabled using [Passport](http://www.passportjs.org/)

**Role Based Access Control** on the routes and can be configured accroding to need to provide limited access based on the role of user.

## Run
1. Install dependencies ``` npm install ```
2. Configure MongoDB uri in ``` config/development.ts ```
3. Get SendGrid API Key from [SendGrid](https://sendgrid.com) and set it in ``` .env ``` file
4. *(Optional)* Default role is user and you can customize acl in ``` src/app/config/nacl.json ```
5. Run ``` tsc ``` in your terminal to compile the code
6. Run ``` node built/app.js ``` to run the project

[Postman](https://www.getpostman.com/) is recommended to send various requests e.g. GET, POST, etc.

* Register user by ``` http:localhost:9000/api/user/register ``` and you will see the user stored in MongoDB

* Now, you can try various other methods such as Forgot Password, Update Password and play around with other custom routes.

* You can perform authentication using ``` auth/ ``` routes.

* You can also query the stored data in database using ``` api/query/ ``` routes.

### References
* For learning more about ACL library used here: [express-acl](https://www.npmjs.com/package/express-acl)
* Library used for [pagination](https://www.npmjs.com/package/mongoose-paginate)

