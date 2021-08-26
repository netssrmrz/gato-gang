# Gato-Gang
Experimental game to simultaneously explore the feasability of creating a real-time multiplayer game using standard HTML/HTTP technologies and building a game in which no one player can progress without the cooperation of other players.
## Tech
- Frontend: Javascript, Web Components, Canvas
- Backend: Firebase realtime database, authentication
- Networking: Data synchronisation occurs via the use of Firebase notifications. Additionally, rather than attempting to continuously update object positions, the whole object "move" request is sent as a parametric equation. This allows each client to calculate the position of the object based on the system clock.
## Game Concept
Gato-Gang is a multiplayer real-time game whereby players must work together to achieve game goals. For example, to open a door, several players may be required to stand on various switches simultaneously.
