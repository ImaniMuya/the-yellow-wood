import { Enemy } from "./enemy";
import { enemySpeed, enemies } from "./globals";
import { field1 } from "./fields";
import Helpers from "./helpers";
import {resourceCounter, waveSpawner} from "./main";




export default class Spawner{
    constructor(waveNumber, spawnLoc, timeBetweenSpawn, timeBetweenWave){
        this.waveNumber = waveNumber;
        this.spawnLoc = spawnLoc;
        this.timeBetweenSpawn = timeBetweenSpawn;
        this.timeBetweenWave = timeBetweenWave;
        this.lastSpawnTime = -1;
        this.enemiesToSpawn = [];
        this.maxWave = 6;
    }

    getWaves(){
        return this.maxWave -this.waveNumber + 1;
    }
    
    spawn(){
        if(this.enemiesToSpawn.length){
            const newEnemy = this.enemiesToSpawn.pop();
            newEnemy.born = true;
            enemies.push(newEnemy);
        }
    } 

    generateNextWave(){
        let num = 3 + this.waveNumber * 3
        if(num > 15){
            num = 15;
        }
        this.generateWave(this.waveNumber, num);
    }

    generateWave(difficulty, number){
        let enemyHealth = 30 + (10* Helpers.randomBetween(1, difficulty));
        let speedDifficulty = difficulty
        if (speedDifficulty > 5){
            speedDifficulty = 5;
        }
        let thisSpeed = enemySpeed + (0.4* Helpers.randomBetween(1, speedDifficulty*1));
        for (let i = 0; i < number; i++){
            const newEnemy = new Enemy( {x: this.spawnLoc.x, y: this.spawnLoc.y}, 40, 0, 0, thisSpeed, enemyHealth, Enemy.BASIC, field1);
            this.enemiesToSpawn.push(newEnemy);
        }
    }

    checkSpawn(){
        if(this.lastSpawnTime === -1 || (this.lastSpawnTime + this.timeBetweenSpawn < Date.now())){
            if(this.enemiesToSpawn.length > 0){
                this.spawn();
                this.lastSpawnTime = Date.now();
            }
        }
    }

    checkWave(){
        if(this.lastSpawnTime === -1 || (this.lastSpawnTime + this.timeBetweenWave < Date.now())){
            if(this.enemiesToSpawn.length === 0){

                this.generateNextWave();
                this.waveNumber++;
                this.timeBetweenSpawn *= 0.5;
            }
        }
    }
    update(){
        if(this.waveNumber > this.maxWave){
            return
        }
        this.checkSpawn();
        this.checkWave();
        if(this.waveNumber === this.maxWave && enemies.length === 0 && this.enemiesToSpawn.length === 0){
            resourceCounter.win();
        }
    }
}