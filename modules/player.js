const Score = require("./score");

/**
 * Represents a player in the game
 * add in the ID # of the player
 */
class Player {
    constructor(username) {
        this.username = username;
        this.score = new Score();
    }
}
module.exports = Player;