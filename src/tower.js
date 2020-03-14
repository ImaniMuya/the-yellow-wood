import Helpers from "./helpers"
import Bullet from "./bullets.js";
import { hitBoxes, bulletSpeed, enemies} from "./globals";
import Vector from "./vector";

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

    findTarget(){
        if(this.target !== null){ //how does target move out of range?
            return
        } else{
            //we don't have target, find one.
            const inRangeEnemies = [];
            enemies.forEach(enemy => {
                if(Helpers.getDistance(enemy, this.position) <= this.range){
                    inRangeEnemies.push(enemy);
                }
            });
            if(inRangeEnemies.length === 0){
                return
            }
            this.target = Helpers.getClosestToBase(inRangeEnemies);
            if(this.lastFired < (Date.now() - this.reloadTime)){
                this.lastFired = Date.now() - this.reloadTime; //this will cause tower to fire instancely after finding a new target 

            }
            return
        }

    }

    shoot() {
        if(this.target.dead === true){
            this.target = null;
            return
        }
        if(Helpers.getDistance(this.position, this.target.position) <= this.range){
            //creat bullet with target
            const p = new Vector(this.x, this.y)
            const newBullet = new Bullet(p, bulletSpeed, this.damage, "divergence", this.target);
            hitBoxes.push(newBullet);
            this.lastFired = this.lastFired + this.reloadTime;
        }else{
            this.target = null;
        }
    }

    update() {
        //if we have a target shoot at it 
        if(this.target !== null){
            if(Date.now() >= this.lastFired + this.reloadTime){
                this.shoot();
            }
        }
        //if not look for a target
        else{
            this.findTarget();
        }

    }

    draw(ctx) {
        ctx.fillStyle = "purple"
        ctx.beginPath()
        ctx.arc(this.x,this.y,10,0,2*Math.PI)
        ctx.fill()
    }


}