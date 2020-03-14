import * as globals from ("../globals.js");
export class Enemy{
    constructor(position, speed, health, type, height, width){
        this.position = position;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.health = health;
        this.type = type;
        this.dead = false;
    }
    getSpeed(){
        return this.speed;
    }
    setSpeed(speed){
        this.speed = speed;
    }
    getHealth(){
        return this.health;
    }
    takeDamage(damage){
        this.health = this.health - damage;
        if(health<= 0){
            this.die();
        }
    }
    die(){
        //do death things
        this.speed = 0;
        this.dead = true;
    }
    move(){

    }
    lose(){
        this.speed = 0;
    }
    
    win(){
        this.speed = 0;
    }

    checkForHit(){
        const hitBoxes = globals.hitBoxes;
        hitBoxes.forEach(hitBox => {
            if(rectContainsRect(this.position.x, hitBox.position.x, this.position.y, hitBox.position.y, this.width, hitBox.width, this.height, hitBox.height) === true){
                this.takeDamage(hitBox.damage);
                hitBox.deleted = true;
            }
        });
    }

    update(){
        this.move();
        
    }

}