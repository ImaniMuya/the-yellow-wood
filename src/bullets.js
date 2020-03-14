export default class Bullet {
    constructor(position, speed, damage, type, target){
        this.position = position;
        this.speed = speed;
        this.damage = damage;
        this.type = type;
        if(this.type === "divergence"){
            this.target = {
                position: {
                    x: target.x,
                    y: target.y
                }
            }
        } else{
            this.target = target;
        }
        this.deleted = false;
        this.lifeSpan = 100000;
        this.lifeEnd = Date.now() + this.lifeEnd;
    }

    get x(){ return this.position.x }
    get y(){ return this.position.y }

    getTarget(){
        return this.target;
    }

    hit(){
        this.target.takeDamage(damage);
        this.deleted = true;
    }

    move(){
       const xDiff = this.target.position.x - this.position.x;
       const yDiff = this.target.position.y - this.position.y;
       const total = Math.abs(xDiff + yDiff); // potentally wrong or exactly right
       const xMag = xDiff / total;
       const yMag = yDiff / total;
       const xVel = xMag * this.speed;
       const yVel = yMag * this.speed;
       this.position.x += xVel;
       this.position.y += yVel;

    }

    update(){
        this.move();
        if(this.lifeEnd < Date.now()){
            this.deleted = true;
        }
        
    }
    draw(ctx) {
        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(this.x,this.y,10,0,2*Math.PI)
        ctx.fill()
    }
}