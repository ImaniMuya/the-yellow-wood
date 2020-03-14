export class Enemy{
    constructor(position, speed, health, type){
        this.position = position;
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
    update(){
        this.move;
    }

}