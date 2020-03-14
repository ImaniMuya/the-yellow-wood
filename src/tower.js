import * as helper from ("../helpers.js");
import * as bullet from ("../bullets.js");
import * as globals from ("../globals.js");

export class Tower{
    constructor(position, type, reloadTime, damage, range){
        this.position = position;
        this.type = type;
        this.reloadTime = reloadTime;
        this.damage = damage;
        this.range = range;
        this.target = null;
        this.lastFired = new Date();
    }

    getDamage(){
        return this.damage;
    }

    getTarget(){
        if(this.target !== null){
            return this.target;
        } else{
            //we don't have target, find one.
            const enemies= [];
            const inRangeEnemies = [];
            enemies.forEach(enemy => {
                if(helper.getDistance(enemy, this.position) <= this.range){
                    inRangeEnemies.push(enemy);
                }
            });
            if(inRangeEnemies.length === 0){
                return null;
            }
            this.target = helper.getClosestToBase(inRangeEnemies);
            if(this.lastFired < (new Date() - this.reloadTime)){
                this.lastFired = new Date() - this.reloadTime; //this will cause tower to fire instancely after finding a new target 
            }
            return this.target;
        }

    }

    shoot(){
        if(helper.getDistance <= this.range){
            //creat bullet with target
            const newBullet = new bullet(this.position, globals.bulletSpeed, this.damage, "divergence", this.target);
            globals.hitBoxes.push(newBullet); 
            this.lastFired = this.lastFired + this.reloadTime;
        }else{
            this.target = null;
        }
    }

    update(){
        //if we have a target shoot at it 
        if(this.target !== null){
            if(new Date() >= this.lastFired + this.reloadTime){
                this.shoot();
            }
        }
        //if not look for a target
        else{
            this.getTarget();

        }
    }


}