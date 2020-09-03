const Message = require("./message");

/**
 * Represents a player in the game
 * add in the ID # of the player
 */
class Player {
    constructor(username) {
        this.username = username;
        this.message = new Message();
    }
}
module.exports = Player;