flowchart TD
    Start[Start] --> CheckAuth[Check authentication status]
    CheckAuth -->|Authenticated| Dashboard[Show dashboard]
    CheckAuth -->|Not authenticated| AuthChoice[Show login or register options]
    AuthChoice -->|Login| LoginForm[Display login form]
    AuthChoice -->|Register| RegisterForm[Display registration form]
    LoginForm --> SubmitLogin[User submits login form]
    SubmitLogin --> ValidateLogin[Validate form data]
    ValidateLogin -->|Invalid| ShowLoginErrors[Display validation errors]
    ShowLoginErrors --> LoginForm
    ValidateLogin -->|Valid| LoginAPI[Call login API]
    LoginAPI -->|Success| StoreToken[Store authentication token]
    LoginAPI -->|Error| ShowLoginError[Display login error]
    ShowLoginError --> LoginForm
    StoreToken --> Dashboard
    RegisterForm --> SubmitRegister[User submits registration form]
    SubmitRegister --> ValidateRegister[Validate form data]
    ValidateRegister -->|Invalid| ShowRegisterErrors[Display validation errors]
    ShowRegisterErrors --> RegisterForm
    ValidateRegister -->|Valid| RegisterAPI[Call registration API]
    RegisterAPI -->|Success| StoreToken
    RegisterAPI -->|Error| ShowRegisterError[Display registration error]
    ShowRegisterError --> RegisterForm