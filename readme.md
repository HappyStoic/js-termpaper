# Klientské aplikace v Javascriptu - term paper

Project was supposed to aim at university students who share flats with other students and offer them fine centralised "information system" about their daily house issues. Unfortunately goal was too big to accomplish and thus only basic functionality is provided.
Project structure documentation and extra information including [screenshots](documentation/resources) can be found in extra [folder](documentation)

## Technologies

### Compilation

* npm install - run once to install all modules listed in package.json

### JS 

* [babelify](https://babeljs.io/docs/setup/) to compile ES6 to older Javascript
* [browserify](http://browserify.org/)to be able to use require
* [jQuery](https://jquery.com/) library to not write so much code 

### CSS

* [sass](https://sass-lang.com/) to compile SCSS to CSS
* [bootstrap](https://getbootstrap.com/) used a little

### Others

* [Seznam mapy](https://api.mapy.cz/) api to show maps  

## Assignment fulfillment

My humble summary so you do not have to search for every detail

| Requirement           | fulfillment        |
| --------------------- | ------------------ |
| **HTML5**             |                    |
| HTML5 validity        | Validator says ok  |
| Browser validity      | Seems ok, tested on Firefox, GoogleChrome, Opera|
| semantic tag          | not sure, but I guess so |
| Graphic - SVG/CANVAS  | SVG icons used in todo section |
| Media - Audio/Video   | No |
| Form features         | Yes |
| Offline application   | It works offline, but I'm not using status from js nor manifest |
| **CSS**               |                     |
| Advanced selectors    | Yes                 |
| Vendor prefixes       | No                  |
| CSS3 Transofrmation   | Yes, 2D - SVG litter bin rotates |
| CSS3 transitions      | Yes, e.g. signIn/signUp forms |
| Media queries         | More no - it is responsive just a little|
| **Javascript**        |                     |
| OOP approach          | Yes, database       |
| JS framework/library  | Yes, jQuery         |
| Advanced JS API       | Yes, Drag and Drop, localStorage, (maps)|
| Working history       | No                  |
| Controlling media     | No                  |
| Offline applikace     |  It works offline, but I'm not using status from js nor manifest|
| JS práce se SVG       | More like no, I work in css with SVG |
| **Others**            |                     |
| Completness           | Eh :/               |
| Appearance            | Ehm :(              |

I also recommend to look at already mentioned full [documentation](documentation)
