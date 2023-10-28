# Tic Tac Toe ❌⭕

Play Tic Tac Toe in your browser!

## Technical Details

There are 2 main views

- Player Type and Name Selection
- Gameboard

I primiarly used factory functions and the module pattern to encapsulate and abstract away different game functionalities. For code that needed to be created a single time, module patterns were used and for code where multiples were needed (i.e. players), factory functions were used and declared multiple times.

Abstrating away functions and variables into these factories and modules helped me preserve / not pollute the root scope to prevent security vulnerabilites.
