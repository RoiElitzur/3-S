# Android WhatsApp Application
This is an Android application that simulates a messaging platform similar to WhatsApp. It includes several screens such as login, register, chat list, current chat, and settings. The application allows users to send and receive messages in real-time.
# About the screens
# Login
The login screen is the entry point of the application. It allows existing users to sign in and access their WhatsApp account. The screen typically consists of a username field and a password field. Users need to provide their valid credentials to proceed further. Once authenticated, the application verifies the user's information and grants access to the chat interface.
# Register
The register screen enables new users to create a WhatsApp account. It presents a form where users can enter their personal information, such as name, picture, and password. After the user fills out the necessary details and submits the form, the application performs validation checks and creates a new account for the user. Upon successful registration, users can log in using their newly created credentials.
# Chat List
The chat list screen is one of the components of the application, where users can communicate with their contacts in real-time. It displays the user's contacts list , the user can choose to enter into one of his contacts' conversation. Users can send text messages.
# Current Chat
The current chat screen is one of the components of the application, where a user can send text messages to the chosen user and to see the conversation's history.
# Settings
The settings screen is one of the components of the application, where a user can change the server's URL and the theme of the application.
###  
# How to Run the Project
Clone the repository to your local machine.
# Server side
1. Go to the directory called "server"
2. Install the necessary dependencies by running the appropriate command  : npm install
3. Start the development server: node app.js
# Client side
1. In order to run the application there are two options:
  - Use Android Studio's emulator and run the project
  - Install the app on Android phone and run it.
2. The default connected server is in the URL "http://10.0.2.2:12345" for Android Studio's emulator, in order to connect another server you need to change it in the settings Activity.    
