This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Preface
To develop this app i used the following assumptions based on every point of the assignment:
1. A Pomodoro consists of 3 timers a Main timer a short break timer and a long break timer.
2. The personalization of the duration of each timer happens at creation then it remains the same, since if it where anyother way it wouldnt really make sense to store a timer since we can just adjust the timer we have to meet the specifications wanted.
3. The circular progress bar should resemble a clock at least in the progress direction (clockwise) since it conveys visual sense.
4. For the timer history we need a database connection to store the different timers. Since express is highly used for projects were a high degree of simultaneous connections are required i used that framework as a backend (it also is quite compact at first)

With these assumptions I developed the app using Next.js since I've never used it before (and i quite liked the routing and hydration system it has!). 

I knew quite about react and React Material UI so I mainly used that for frontend components.

Finally I had a little experience using express for small backend tasks so I used that for the api.

The database framework used was SQlite since its quite portable and easy to use locally and i only really needed basic SQL functionality.

## Future Work

For time reasons I couldn't quite do all I wanted so out of the top of my mind the pending aspects of the app are:

1. Add logout functionality
2. When a pomodoro is complete initialize short/long break as required automatically
3. Make the progress bar have a background shadow which contours the circle before it is completed, (currently is just empty space and is ugly)
4. Order and tidy some lines of code



## Getting Started
First install App requirements :
```bash
npm install
```

Second fire up the backend API:
```bash
node api.js
```

Third, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to run the app Frontend.

Open [http://localhost:3001/test_api](http://localhost:3001/test_api) to check api connection.

Open [http://localhost:3001/test_api_db](http://localhost:3001/test_api_db) to check api database connection.
