import Helpers from "./helpers"
import Bullet from "./bullets.js";
import { hitBoxes, bulletSpeed, bulletRadius, enemies, getEl, upgradeCost} from "./globals";
import Animation from "./animator";
import Vector from "./vector";
import {resourceCounter} from "./main";
import { Particles } from "./particles"


const towerR = 20
const frames = [
    {"x":106,"y":287,"w":640,"h":837,"ax":440,"ay":518+200},
    {"x":1104,"y":273,"w":814,"h":877,"ax":1504,"ay":464+200},
    {"x":339,"y":1320,"w":859,"h":888,"ax":777,"ay":1620+200},
]


export default class Tower{
    constructor(position, type, reloadTime, damage, range){
        this.position = position;
        this.type = type;
        this.reloadTime = reloadTime;
        this.damage = damage;
        this.range = range;
        this.target = null;
        this.lastFired = Date.now();
        this.anim = new Animation(getEl("archerImg"), frames, Animation.getLinearFrameSelector(500,3))

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
        this.anim.start()
        if(this.target.dead === true){
            this.target = null;
            return
        }
        if(Helpers.getDistance(this.position, this.target.position) <= this.range){
            //creat bullet with target
            const p = new Vector(this.x, this.y)
            const newBullet = new Bullet(p, bulletRadius, bulletSpeed, this.damage, "", this.target);
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
        this.anim.draw(ctx, this.x, this.y, false, .1)
    }

    contains(position) {
        return Helpers.circleContainsPoint(this.position, towerR, position)
    }

    static drawTowerProfile(ctx) {
    //     ctx.fillStyle = "red"
    //     ctx.fillRect(40,700,300,275)
        ctx.drawImage(getEl("archerImg"),339,1320,859,888, 40, 700, 300, 275);
        ctx.fillStyle = "#AAA"
        ctx.fillRect(700,728,200,200)
        ctx.strokeStyle = "#000"
        ctx.strokeRect(700,728,200,200)
        ctx.fillStyle = "purple"
        ctx.fillText("Upgrade (20)", 713, 830)
    }

    upgrade(){
        if(resourceCounter.getResources() < upgradeCost){
            //upgrade too expensive
            getEl("nopeSfx").currentTime = 0
            getEl("nopeSfx").play()
            return
        }
        resourceCounter.spendResources(upgradeCost);
        this.damage += 3;
        this.range += 50;
        Particles.spiral(this.x,this.y,"cyan",10,5)
        
    }
}