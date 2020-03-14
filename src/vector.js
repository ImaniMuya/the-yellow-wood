export class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    getPosition(){
        return{
            x : this.x,
            y : this.y
        }
    }
    setPosition(x,y){
        this.x = x;
        this.y = y;
    }
}