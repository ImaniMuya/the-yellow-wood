export class Enemy{
    constructor(position, speed, health, type){
        this.position = position;
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
    update(){
        this.move();
    }
    draw(ctx) {
        ctx.fillStyle = "green"
        ctx.fillRect(this.x, this.y, 50, 50)
    }

}