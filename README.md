# Advanced-Real-Time-Sales-Analytics-System_Express_React_SQLite
![javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
)
![postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)

### Minimal Advanced Real-Time Sales Analytics System implementing everything from scratch (as possible)

![project image 1](https://github.com/MohabGamal/Advanced-Real-Time-Sales-Analytics-System_Express_SQLite/blob/main/media/img1.jpg)
![project image 2](https://github.com/MohabGamal/Advanced-Real-Time-Sales-Analytics-System_Express_SQLite/blob/main/media/img2.jpg)


## How to Run
- Dev Enviroment: execute "npm run dev" inside "backend" folder to run a server on http://localhost:8800, also in "frontend" folder to run a vite server on http://localhost:5173 
- Production Enviroment: execute "npm run build" inside "forntend" folder, and "npm run prod" inside "backend" folder to run the website server on http://localhost:8800
- API endpoints: in Real-Time Sales Analytics.postman_collection.json

<hr> 

## AI Assistance
- Setup of TS
- Setup of WS lib
- Implementing Node.Js Fetch from http module
- Helping with hard-to-detect SQL syntax errors
- Chart implementaion in CSS
<hr>

## Manual Implementation
- Using SQLite lib because native SQLite is not supported in Node.Js yet
- Using WS lib because native WS is not supported in Node.Js yet. However using native WebSockets in client-side
- Using React and Express wasn't necessary, however this aligns with the job main technologies
- From scratch techs: Charting, Data Fetching, Error Handling, API Integration, Testing, SQL

<hr>

## Structure
### Backend:
-  Using, src folder for source code execluding non-code files
-  Using, (routes -> controllers -> services) pattern. routes to gather all endpoints in one place, controllers for everything related to (req & res & next), services for general business logic. 
-  dev folder for stand-alone scritps to modify db for example
### Frontend:
-  Using useFetch with useEffect for the simplest unified data fetching logic, without indulging into thir-parties or React 19 features.
-  Using vite for fast, modern React bundling
<hr>

## API Integrations
- Gemeni: for AI weather and product recommendations
- OpenWeather: for getting the current weather degree of the city of the client 
- ip-api.com: for getting the city of the client from their IP address 

