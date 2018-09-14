# Homework Assignment #2

This project has codebase for assignment #2.

# How to run
Before you the project, we need to set environment variables for Mailgun and
Stripe.
We have used Mailgun for sending email after order is placed. Use following
command to set base64 token via command prompt

export MAILGUN=<<Base64 token of mailgun>>

The reason being, mailgun privacy policy does not allow the token being committed
to open repositories like github or bitbucket.

Similar to this, I've also exported Stripe token secret key. Use following command.
export STRIPE=<<Stripe test secret key>>

The reason is same, it's privacy policy does not allow it's token being flaunted
openly.

Once these 2 steps are done, you can use one of the following commands to run the
project.

$ NODE_ENV=staging node index.js // for staging environment
$ NODE_ENV=production node index.js // for production environment

# Services
It offers following services.

## Create new user
Method: POST
Endpoint: http://localhost:8000/user
Headers: None
Body: It should have following mandatory fields

email, phone, password, countryCode, streetAddress, pinCode

Following is sample Body

{"email" : "validEmail@OfTheUser.com"
,"phone":"1247612741"
,"password":"<<password according to password policy>>"
,"countryCode" : 91
,"streetAddress" : "Plot no 21, Badrinath society parate layout, Nagpur, Maharashtra"
,"pinCode" : "440025"
}

Note: After signup, you do not immediately get token. You need to login to get
      token which can be used for sub-sequent api calls.

## Login
Method: POST
Endpoint: http://localhost:8000/auth
Headers: None
Body:
     email, password
Following is sample body

{"email" : "validEmail@OfTheUser.com"
,"password":"<<password according to password policy>>"
}

Response:
{
    "token": "wri2zkgbah46oemocm4c",
    "email": "validEmail@OfTheUser.com",
    "expiry": 1537000359708
}

Expiry for staging is 24 hours and production is one hour.

## Get user data
Method: GET
Endpoint: http://localhost:8000/user
Headers: token (token received after user login)
QueryString: email=validEmail@OfTheUser.com
Body: None

Sample URL: http://localhost:8000/user?email=validEmail@OfTheUser.com

Response:
{
    "email": "validEmail@OfTheUser.com",
    "phone": "3423412412",
    "countryCode": 91,
    "streetAddress": "Plot no 21, Badrinath society parate layout, Nagpur",
    "pinCode": "440025",
    "orders": [
        "532hym8fu0",
        "ogv20fkybo",
        "d3qzo747ta",
        "6gx1yz81g9",
        "y5tevzh1d1",
        "8tiom6sdoj"
    ]
}

## Update user data
Method: PUT
Endpoint: http://localhost:8000/user
Headers: token (token received after login)
QueryString : email=validEmail@OfTheUser.com
Body:
email and other fields which you want to update.
Note 1: You can not update email

Note 2: You can pass email either in query string or through body. Either of it
is mandatory.

Sample URL:
http://localhost:8000/user?email=validEmail@OfTheUser.com

Sample Response:
{
    "email": "validEmail@OfTheUser.com",
    "phone": "1287412921",
    "countryCode": 91,
    "streetAddress": "Plot no 21, Badrinath society parate layout, Nagpur",
    "pinCode": "440024",
    "orders": [
        "532hym8fu0",
        "ogv20fkybo",
        "d3qzo747ta",
        "6gx1yz81g9",
        "y5tevzh1d1",
        "8tiom6sdoj"
    ]
}

You will get whole response with update data.

## Delete user account
Method: DELETE
Endpoint: http://localhost:8000/user
Headers: token (valid token obtained after user login)
QueryString: email=validEmail@OfTheUser.com
Body: email=validEmail@OfTheUser.com
Note: Email can be passed either through query string or through body. Either of
it is mandatory.

Sample Response:
{} // empty object
