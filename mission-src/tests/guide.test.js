import test from 'node:test';import assert from 'node:assert/strict';import {missionGuide} from '../src/ui/mission-guide.js';import {newProgress} from '../src/missions/progression.js';import {createPhysicalStudy,physicalAction} from '../src/systems/physical-study.js';import {createEnergyStudy} from '../src/systems/energy-study.js';import {createPlant} from '../src/systems/life-support.js';
test('the child guide exposes one current action and advances from pickup to removal to placement',()=>{const p=newProgress();p.briefed=true;p.bloop.introduced=true;let s=createPhysicalStudy();const g=()=>missionGuide(p,s,createEnergyStudy(),createPlant());assert.equal(g().action,'take-water');s=physicalAction(s,{type:'pickup',kind:'water'}).state;assert.equal(g().action,'release-water');s=physicalAction(s,{type:'remove',kind:'water'}).state;assert.equal(g().action,'socket-water');assert.equal(g().owner,'bloop');assert.ok(g().text.length<80);});

import {Vector3} from 'three';
import {guidedTarget} from '../src/world/interactions.js';
test('keyboard task focus selects the reachable current action, rejecting locked or distant controls',()=>{
 const position=new Vector3(0,1.65,0);
 const adjacent={id:'water-selector',point:new Vector3(0,1.6,.2)};
 const goal={id:'habitat-test',point:new Vector3(0,1.6,2),enabled:()=>true};
 assert.equal(guidedTarget([adjacent,goal],'habitat-test',position),goal);
 assert.equal(guidedTarget([adjacent,{...goal,enabled:()=>false}],'habitat-test',position),null);
 assert.equal(guidedTarget([{...goal,point:new Vector3(0,1.6,9)}],'habitat-test',position),null);
});
