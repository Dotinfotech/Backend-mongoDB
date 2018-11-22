/**
 * @swagger
 *
 * /api/user/register:
 *  post:
 *      tags:
 *          - User
 *      description: Register the user to application
 *      consumers:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: registration
 *            description: Registration Details
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/registration'
 *      responses:
 *          200:
 *              description: User Registered Successfully!
 */

/**
 * @swagger
 * definitions:
 *  registration:
 *      type: object
 *      required:
 *          email
 *          password
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          confirm_password:
 *              type: string
 *          first_name:
 *              type: string
 *          last_name:
 *              type: string
 *          phone_number:
 *              type: number
 *
 */

/**
 * @swagger
 * /api/user/forgotpassword:
 *  post:
 *      tags:
 *          - User
 *      description: Sends Forgotpassword request to application
 *      consumers:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Forgot Password
 *            description: Sends Forgotpassword request to application 
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/forgotpassword'
 *      responses:
 *          200:
 *              description: Email sent Successfully!
 * 
 */ 

/**
 * @swagger
 * definitions:
 *  forgotpassword:
 *      type: object
 *      required:
 *          email
 *      properties:
 *          email:
 *              type: string
 * 
 */

/**
 * @swagger
 * /api/user/resetpassword:
 *  post:
 *      tags:
 *          - User
 *      description: resets the password of user
 *      consumers:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Reset Password
 *            description: resets the password of user
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/resetpassword'
 *      responses:
 *          200:
 *              description: Password been changed Successfully!
 * 
 */

/**
 * @swagger
 * definitions:
 *  resetpassword:
 *      type: object
 *      required:
 *          token
 *          new_password
 *          confirm_password
 *      properties:
 *          token:
 *              type: string
 *          new_password:
 *              type: string
 *          confirm_password:
 *              type: string
 * 
 */ 

/**
 * @swagger
 * /api/user/updatepassword:
 *  post:
 *      tags:
 *          - User
 *      description: updates the password of user
 *      consumers:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Authorization
 *            description: access token got after login to update password
 *            in: header
 *            type: string
 *            required: true
 *          - name: Update Password
 *            description: updates the password of user
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/updatepassword'
 *      responses:
 *          200:
 *              description: Password been updated Successfully!
 * 
 */

/**
 * @swagger
 * definitions:
 *  updatepassword:
 *      type: object
 *      required:
 *          email
 *          old_password
 *          new_password
 *          confirm_password
 *      properties:
 *          email:
 *              type: string
 *          old_password:
 *              type: string
 *          new_password:
 *              type: string
 *          confirm_password:
 *              type: string
 * 
 */ 

/**
 * @swagger
 * /api/user/register_verify:
 *  post:
 *      tags:
 *          - User
 *      description: verifies the registration of user and sends the mail to registered email
 *      consumers:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Email
 *            description: Enter the registered email
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/register_verify'
 *      responses:
 *          200:
 *              description: Email sent Successfully! 
 */

/**
 * @swagger
 * definitions:
 *  register_verify:
 *      type: object
 *      required:
 *          email
 *      properties:
 *          email:
 *              type: string
 */ 

/**
 * @swagger
 * /api/user/welcome_user:
 *  post:
 *      tags:
 *          - User
 *      description: sends the welcome message to user's registered email
 *      consumers:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Email
 *            description: Enter the registered email
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/welcome_user'
 *      responses:
 *          200:
 *              description: Email sent Successfully! 
 */

/**
 * @swagger
 * definitions:
 *  welcome_user:
 *      type: object
 *      required:
 *          email
 *      properties:
 *          email:
 *              type: string
 */

/**
 * @swagger
 * /api/user/verifytoken:
 *  post:
 *      tags:
 *          - User
 *      description: verifies the forgotpassword token sent to user's registered email
 *      consumes:
 *          - application/x-www-form-urlencoded
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: token
 *            description: Enter the forgotpassword token
 *            in: formData
 *            type: string
 *            required: true
 *            schema:
 *              $ref: '#/definitions/verifytoken'
 *      responses:
 *          200:
 *              description: token is valid! 
 */

/**
 * @swagger
 * definitions:
 *  verifytoken:
 *      required:
 *          token
 *      properties:
 *          token:
 *              type: string
 */





/**
 * @swagger
 * /auth/local:
 *  post:
 *      tags:
 *          - Auth
 *      description: User Login with email and password
 *      consumes:
 *          - application/x-www-form-urlencoded
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: email
 *            description: Enter email
 *            in: formData
 *            type: string
 *            required: true
 *          - name: password
 *            description: Enter password
 *            in: formData
 *            type: string
 *            required: true
 *      responses:
 *          200:
 *              description: Logged in Successfully! 
 */
 




/**
 * @swagger
 * /api/query/{collection}:
 *  get:
 *      tags:
 *          - Query
 *      description: Query the data by collection model
 *      parameters:
 *        - name: Authorization
 *          description: Authorization token
 *          in: header
 *          type: string
 *          required: true
 *        - name: collection
 *          description: Collection Model Name (e.g. User)
 *          in: path
 *          type: string
 *          required: true
 *        - name: page
 *          description: enter page number
 *          in: query
 *          type: integer
 *          required: false
 *      responses:
 *          200:
 *              description: Query fired successfully!
 */

/**
 * @swagger
 * /api/query/{collection}/{id}:
 *  get:
 *      tags:
 *          - Query
 *      description: Query the data by user id
 *      parameters:
 *        - name: Authorization
 *          description: Authorization token
 *          in: header
 *          type: string
 *          required: true
 *        - name: collection
 *          description: Collection Model Name (e.g. User)
 *          in: path
 *          type: string
 *          required: true
 *        - name: id
 *          description: enter user id
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Query fired successfully!
 */

/**
 * @swagger
 * /api/query/{collection}/{id}:
 *  post:
 *      tags:
 *          - Query
 *      description: Change the user details by user id
 *      parameters:
 *        - name: Authorization
 *          description: Authorization token
 *          in: header
 *          type: string
 *          required: true
 *        - name: collection
 *          description: Collection Model Name (e.g. User)
 *          in: path
 *          type: string
 *          required: true
 *        - name: id
 *          description: enter user id
 *          in: path
 *          type: string
 *          required: true
 *        - name: changes in data
 *          in: body
 *          required: true
 *          schema: 
 *              $ref: '#/definitions/changedatabyid'
 *      responses:
 *          200:
 *              description: Data changed successfully!
 */

/**
 * @swagger
 *  definitions:
 *      changedatabyid:
 *        type: object
 *        required:
 *          first_name
 *          last_name
 *          email
 *          phone_number
 *          full_name
 *        properties:
 *              first_name:
 *                      type: string
 *              last_name:
 *                      type: string
 *              email:
 *                      type: string
 *              phone_number:
 *                      type: integer
 *              full_name:
 *                      type: string
 */

/**
 * @swagger
 * /api/query/{collection}/{id}:
 *  delete:
 *      tags:
 *          - Query
 *      description: Delete the user by user id
 *      parameters:
 *        - name: Authorization
 *          description: Authorization token
 *          in: header
 *          type: string
 *          required: true
 *        - name: collection
 *          description: Collection Model Name (e.g. User)
 *          in: path
 *          type: string
 *          required: true
 *        - name: id
 *          description: enter user id
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Data deleted successfully!
 */

/**
 * @swagger
 * /api/query/soft/{collection}/{id}:
 *  delete:
 *      tags:
 *          - Query
 *      description: Delete the user by user id
 *      parameters:
 *        - name: Authorization
 *          description: Authorization token
 *          in: header
 *          type: string
 *          required: true
 *        - name: collection
 *          description: Collection Model Name (e.g. User)
 *          in: path
 *          type: string
 *          required: true
 *        - name: id
 *          description: enter user id
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Soft-deleted Data  successfully!
 */

/**
 * @swagger
 * /api/query/execute/conditions/{collection}:
 *  post:
 *      tags:
 *          - Query
 *      description: Fetch the data by particular field
 *      parameters:
 *        - name: Authorization
 *          description: Authorization token
 *          in: header
 *          type: string
 *          required: true
 *        - name: collection
 *          description: Collection Model Name (e.g. User)
 *          in: path
 *          type: string
 *          required: true
 *        - name: field(s)
 *          description: enter the field by which you want to find the data
 *          in: body
 *          required: true
 *          schema: 
 *              $ref: '#/definitions/findbyfield'
 *      responses:
 *          200:
 *              description: Data deleted successfully!
 */

/**
 * @swagger
 *  definitions:
 *      findbyfield:
 *        type: object
 *        required:
 *          first_name
 *          last_name
 *          role
 *        properties:
 *              first_name:
 *                      type: string
 *              last_name:
 *                      type: string
 *              role:
 *                      type: string
 */
