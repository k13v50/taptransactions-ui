# LittleTrips Frontend Application
This application provides a way for user to view their trip history.
This application utilizes the LittleTrips Backend Application.

## Pre-req:
- NodeJS installed
- Date-FNS installed (npm install date-fns)

## To run application
npm run dev

## User Login
This application utilizes the /little-trips/api/v1/auth/login endpoint for user login. 
Users must be registered on the LittleTrips Backend Application to be able to successfully login

## User Dashboard
The user dashboard present the Trip History of the user.
The data presented in paged by 10.
The user can sort the data based on the selected column.
The user is also able to search via 2 options:
- select a specific field to sort
- select a date range which will be used to query the trip results based on the Departure Time/Date

# Assumptions and Limitations
- This UI only utilizes the simple login from the backend
- Simple search and sort functionality is supported
- Vibe coded with Gemini free tier
- UI display is limited and becomes jumbled when screen size is reduced.
- Followed this tutorial before starting this project: https://www.youtube.com/watch?v=Wt3isV2irrA&t=2094s

# Others
## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

