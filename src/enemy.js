import { hitBoxes} from "./globals";
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

    static get BASIC() { return 52}

    get x(){ return this.position.x}
    get y(){ return this.position.y}

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
        // from flow field
        this.position.x += 1
    }
    lose(){
        this.speed = 0;
    }
    
    win(){
        this.speed = 0;
    }

    checkForHit(){
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
    draw(ctx) {
        ctx.fillStyle = "green"
        ctx.fillRect(this.x, this.y, 50, 50)
    }

}