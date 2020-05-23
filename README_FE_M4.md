# Just One Web App - SoPra Group 13

This project started as part of the SoPra course. We wanted to create a web application for the 
popular board game Just One. The goal of the project is to allow people all over the world to play with each other.
additionally we wanted to create a competitive environment. To achieve that we implemented a automated scoring system
that uses NLP to check the validity of clues and a JPA database to store all scores of every player over all played 
games. The scores of all players are ranked on a public leaderboard. If a group wants more players they can add bots 
to the game. The bots use NLP to give either good or bad clues.

## Getting started with React

Read and go through those Tutorials, It will make your life easier!

- Read the React [Docs](https://reactjs.org/docs/getting-started.html)
- Do this React [Getting Started](https://reactjs.org/tutorial/tutorial.html) Tutorial (it doesn’t assume any existing React knowledge)
- Get an Understanding of [CSS](http://localhost:3000) and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Once you have done all of this, in the template there are two main external dependencies that you should look at:

- [styled-components](https://www.styled-components.com/docs)
  It removes the mapping between components and styles (i.e. external css files). This means that when you're defining your styles, you're actually creating a normal React component, that has your styles attached to it
* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) Declarative routing for React being a collection of navigational components that compose declaratively with your application. 

<!-- ## IDE Recommendation
As a student, you have the possibility with [JetBrains](https://www.jetbrains.com/student/) to obtain a free individual license and have access to several IDEs. 
We recommend you to use [WebStorm](https://www.jetbrains.com/webstorm/specials/webstorm/webstorm.html?gclid=EAIaIQobChMIyPOj5f723wIVqRXTCh3SKwtYEAAYASAAEgLtMvD_BwE&gclsrc=aw.ds) for your front-end. 
Once you have downloaded and installed it, you can add the following WebStorm plugins: 
> Go to Preferences > Plugins > Browse Repositories and look for: 
* [styled-components](https://plugins.jetbrains.com/plugin/9997-styled-components) (provides coding assistance like CSS Highlighting for Styled Components)
* [prettier](https://plugins.jetbrains.com/plugin/10456-prettier) (a smart code formatter)
* [Material Theme UI](https://plugins.jetbrains.com/plugin/8006-material-theme-ui) (Material Theme for Jetbrains IDEs, allowing a total customization of the IDE including Themes, Color Schemes, Icons and many other features.)

Feel fre e to use other IDEs (e.g. [VisualStudio](https://code.visualstudio.com/)) if you want.  -->

## Prerequisites and Installation

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All other dependencies including React get installed with:

### `npm install`

This has to be done before starting the application for the first time (only once).

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console (use Google Chrome!).

### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

## Illustrations/UI Flow

As usual every user can create an account with and log in with its user name 
and password. After the login to the dashboard you can create your own lobby and set it
on public or private. On the tab "Public Lobbies" you can join public lobbies, which are not 
in the game yet or join a private lobby through a four ciphers password.

![All Lobies](Img/Lobbies.png)

Important: There is no feature to communicate the four ciphers of a private lobby. Either
communicate orally or by third party tool.

Setup: It needs at least 3 players to join the game. One game contains a deck with 13 cards, 
therefore at most 13 topics.

![In a Lobby](Img/Lobby.png)

As lobby creator/admin you can add/kick bots and kick players. An admin can only leave a lobby,
if you are the last player in the lobby. Player and bots have different behaviour. By "Join into Game"
you enter the game "Just One". Unity can take time to load all components and waits for all players until
all players has loaded. Please be patient. 

Important: Don't switch or close the tab. In that case you left the game and it is over.

When the game begins, you are either a guesser or clue giver:
Clue giver votes one topic of five and gives a clue related to the topic within 30s for
the guesser.
The guesser(/active player) waits for the clues. At this point there are three outcomes:
- guess the word; if it's correct, points will be calculated related to the amount of time
- guess the word; if it's wrong, then there will be no points and the current card and also
 an additional card will be discarded
- skip this round; there will be no points and only this current topic will be discarded

![Dashboard with Leaderboard](Img/Dashboard.png)

The application contains some features:
- ranking system; visualized by the picture and rank name, depending on the current score
- leaderboard
- editing profile (avatar choice, username)
- a short game description
- chat feature in the lobby

## Road Map
Possible features to enhance UX:
- add chat to the game
- additional language settings
- rejoin session after disconnect
- guest mode for spectactors

## Authors
Simon Padua

Chris Aeberhard

 Thanh Huynh
 
Ivan Allinckx

 Marc Kramer

## License
Copyright (c) [2020] [Sopra Group13]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


>Thanks to Lucas Pelloni for the template
