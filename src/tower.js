import Helpers from "./helpers"
export default class Tower{
    constructor(position, type, reloadTime, damage, range){
        this.position = position;
        this.type = type;
        this.reloadTime = reloadTime;
        this.damage = damage;
        this.range = range;
        this.target = null;
        this.lastFired = Date.now();
    }

    static get BASIC() { return 42}

    get x(){ return this.position.x}
    get y(){ return this.position.y}
    
    getDamage(){
        return this.damage;
    }

    getTarget(){
        if(this.target !== null){ //how does target move out of range?
            return this.target;
        } else{
            //we don't have target, find one.
            const enemies= [];
            const inRangeEnemies = [];
            enemies.forEach(enemy => {
                if(Helpers.getDistance(enemy, this.position) <= this.range){
                    inRangeEnemies.push(enemy);
                }
            });
            if(inRangeEnemies.length === 0){
                return null;
            }
            this.target = Helpers.getClosestToBase(inRangeEnemies);
            if(this.lastFired < (Date.now() - this.reloadTime)){
                this.lastFired = Date.now() - this.reloadTime; //this will cause tower to fire instancely after finding a new target 

            }
            return this.target;
        }

    }

    shoot(){
        //creat bullet with target
        this.lastFired = this.lastFired + this.reloadTime;
    }

    update(){
        //if we have a target shoot at it 
        if(this.target !== null){
            if(Date.now() >= this.lastFired + this.reloadTime){
                this.shoot();
            }
        }
        //if not look for a target
        else{
            this.getTarget();

        }
    }

    draw(ctx) {
        ctx.fillStyle = "purple"
        ctx.beginPath()
        ctx.arc(this.x,this.y,10,0,2*Math.PI)
        ctx.fill()
    }


}