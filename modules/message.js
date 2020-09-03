/**
 * Represents the score that a player has
 * 
 * Make class message instead and store current string that player has entered
 */
class Message
{
    constructor() {
        console.log('there is ablank message');
        this.currentMessage = "";
        //this.scoreOverTime = [0,0]; //keeps track of scores spanning the last 5 seconds
    }

    UpdateString(newMessage)
    {
        console.log('updaing your message with the string ' + newMessage);
        this.currentMessage = newMessage;
    }

    ReturnString() {

        return this.currentMessage;
    }
    AddPoint()
    {
        console.log('this is Addpoint and it does nothing please help');
        //this.scoreOverTime[0] += 1; //add a single point to this current second's score total
    }


    //return the combined value of points over the last 5 seconds
    SumPoints()
    {
        console.log('this is SumPoints and it does nothing please help');
        //let sum = 0;

        //for(let i = 0; i < this.scoreOverTime.length; i++)
        //{
        //    sum += this.scoreOverTime[i];
        //}
        
        //return sum;
    }

    ClearString() {
        console.log('I am clearning the current menssage');
        this.currentMessage = "";
    }

    //one would assume that this clears the scores
    ClearScore()
    {
        console.log('this is ClearScore and it does nothing please help');
        //this.scoreOverTime = this.scoreOverTime.map(x=> 0);
    }


    //Called every second. Move each score counter over a second.
    ShiftScores()
    {
        console.log('this is ShiftScore and it does nothing please help');
        //each index pulls the value from the previous index. This results in the loss of the final index's value
        //for(let i = this.scoreOverTime.length - 1; i > 0; i--)
        //{
        //    this.scoreOverTime[i] = this.scoreOverTime[i-1];
        //}

        //this.scoreOverTime[0] = 0; //reset the value of the current second

    }

};

module.exports = Message;