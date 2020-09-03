const User = require("./user");
/**
 * Structure which describes a room
 */
class Room {
    /**
     * Create a new room
     * @param {String} code room code
     * @param {String[]} categories array of possible categories
     */
    constructor(code) {
        this.code = code;
        //this.categories = categories;
        this.users = []; // Array of player objects
        //this.selectedPlayers = []; // Array of selected player indexes
        //this.playedplayers = []; // Array of played player indexes
        //this.startLifetime = 1000;
       //this.resetLifetime(); // In seconds TODO make this customizable
        //this.inProgress = false;
        //this.unselectedPlayers=[];
    }

    /**
     * Resets the lifetime of the room
     */
    resetLifetime() {
        console.log('This is resetLifetime and it is returning nothing, you should probably check that out')
        //this.lifetime = this.startLifetime;
    }


    /**
     * Returns true if this room has the provided username, false otherwise
     * @param {String} username
     */
    hasUser(username) {
        return this.users.filter(user => user.username == username).length == 1;
    }

    /**
     * Selects the two players. After this is called, selectedPlayers will be up to date.
     * @return {Player[]} The selected players
     */
    //selectplayers() {
    //    this.selectedplayers = [];
    //    this.unselectedplayers = this.players.filter(player=> !this.playedplayers.includes(player));

    //    for (let i = 0; i < 2; ++i) {
    //        let randi = parseint(math.random() * this.unselectedplayers.length);
    //        let curselectedplayer = this.unselectedplayers[randi];
    //        this.selectedplayers.push(curselectedplayer);
    //        this.playedplayers.push(curselectedplayer);

    //        this.unselectedplayers.splice(this.unselectedplayers.indexof(curselectedplayer), 1);
    //        if (this.unselectedplayers.length == 0) {
    //            this.playedplayers=[];// reset the playedplayer list
    //            this.playedplayers.push(curselectedplayer);
    //            this.unselectedplayers = this.players.filter(player=> !this.playedplayers.includes(player));
    //        }
    //    }

    //    return this.selectedPlayers;
    //}

    /**
     * Removes old points from each player's score
     */
    //shiftScores(){

    //    for(let i = 0; i < this.players.length; i++)
    //    {
    //        this.players[i].score.ShiftScores();
    //    }

    //}

    /**
     * Returns the display percentage based on the two selected players' scores
     */
    getDisplayPercentage() {
        console.log('getdisplaypercentage currently does nothing, you should probably check that out');
        // Array destructuring to extract player scores
        ////const [score1, score2] = this.selectedPlayers.map(player => {player.score.SumPoints();});
        //player.message.currentMessage
        //let score1 = this.selectedUsers[0].score.SumPoints();
        //let score2 = this.selectedUsers[1].score.SumPoints();

        //if (score1 == 0 && score2 == 0) {
        //    return .5;
        //}
        //return score2 / (score1 + score2);
    }

    /**
     * Get and return a random category, while also removing it from the categories array
     * @returns {String} the category
     */
    //getAndRemoveRandomCategory() {
    //    let remIndex = parseInt(Math.random() * this.categories.length);
    //    return this.categories.splice(remIndex, 1)[0];
    //}
}
module.exports = Room;
