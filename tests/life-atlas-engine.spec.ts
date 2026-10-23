import {test,expect} from './fixtures';
import {advance,automaticChoice,canChoose,choose,createLife,emptySave,events,getEvent,parseSave,regions,updateSave,yearlyBudget,type Life} from '../src/games/life-atlas/engine';

function finish(seed:number,focus:Life['focus']='learn') {
  let life=createLife(seed);life={...life,focus};
  for(let i=0;i<250&&!life.ended;i++)life=life.pending?automaticChoice(life):advance(life);
  return life;
}
test('identical seeds and choices reproduce the complete journey',()=>{
  expect(finish(4312)).toEqual(finish(4312));
  expect(createLife(4312)).not.toEqual(createLife(4313));
});
test('every fictional birthplace is selectable and random draws stay in range',()=>{
  expect(regions.reduce((sum,r)=>sum+r.weight,0)).toBe(100);
  regions.forEach((_,region)=>expect(createLife(512,region).region).toBe(region));
  for(let seed=0;seed<100;seed++)expect(createLife(seed*7919).region).toBeGreaterThanOrEqual(0);
});
test('a pending decision blocks year advancement and invalid actions have no effect',()=>{
  let life=createLife(900);
  for(let i=0;i<6;i++)life=advance(life);
  expect(life.pending).toBe('first-friend');
  expect(advance(life)).toBe(life);
  expect(choose(life,'not-a-choice')).toBe(life);
  const next=choose(life,'hello');
  expect(next.pending).toBeNull();expect(next.stats.bonds).toBeGreaterThan(life.stats.bonds);
  expect(choose(next,'hello')).toBe(next);
});
test('college and later research roles require the actual resources and qualification',()=>{
  const base={...createLife(50),age:18,pending:'path',money:100,stats:{health:70,joy:60,knowledge:90,bonds:50}};
  const college=getEvent('path')!.choices.find(c=>c.id==='degree')!;
  expect(canChoose(base,college)).toBe(false);
  expect(choose(base,'degree')).toBe(base);
  const student=choose({...base,money:1200},'degree');
  expect(student.money).toBe(700);expect(student.qualification).toBe(2);
  const candidate={...student,age:22,pending:'career'};
  expect(choose(candidate,'research').job).toBe(3);
  const unqualified={...candidate,qualification:0};
  expect(choose(unqualified,'research')).toBe(unqualified);
});
test('a choice deducts its cost exactly once and cannot mutate the prior life',()=>{
  const base={...createLife(5),age:30,pending:'home',money:900};
  const old=JSON.stringify(base),next=choose(base,'settle');
  expect(next.money).toBe(250);expect(JSON.stringify(base)).toBe(old);
  expect(choose(next,'settle').money).toBe(250);
});
test('every event has an available fallback with no money or qualification',()=>{
  for(const event of events){
    const life={...createLife(10),age:30,money:0,qualification:0,pending:event.id,stats:{health:50,joy:50,knowledge:0,bonds:50}};
    expect(event.choices.some(c=>canChoose(life,c)),event.id).toBe(true);
    expect(automaticChoice(life).pending,event.id).toBeNull();
  }
});
test('career, work focus and retirement affect the budget independently',()=>{
  const child=createLife(4,0);
  expect(yearlyBudget(child)).toEqual({income:0,cost:0});
  const adult={...child,age:30,job:1};
  const base=yearlyBudget(adult);
  expect(yearlyBudget({...adult,job:3}).income).toBe(base.income+190);
  expect(yearlyBudget({...adult,focus:'work'}).income).toBe(base.income+100);
  expect(yearlyBudget({...adult,age:65,focus:'work'})).toEqual(yearlyBudget({...adult,age:65,focus:'rest'}));
});
test('focus creates different long-term outcomes without exceeding stat limits',()=>{
  const base=createLife(456);
  const learner=advance({...base,focus:'learn'}),rested=advance({...base,focus:'rest'});
  expect(learner.stats.knowledge).toBeGreaterThan(rested.stats.knowledge);
  expect(rested.stats.health).toBeGreaterThan(learner.stats.health);
  for(let seed=0;seed<100;seed++){
    const life=finish(seed*104729,['learn','rest','connect','work'][seed%4] as Life['focus']);
    expect(life.ended).toBe(true);expect(life.age).toBeGreaterThanOrEqual(65);expect(life.age).toBeLessThanOrEqual(96);
    expect(life.money).toBeGreaterThanOrEqual(0);
    for(const value of Object.values(life.stats)){expect(value).toBeGreaterThanOrEqual(0);expect(value).toBeLessThanOrEqual(100);}
    expect(life.log[0].kind).toBe('ending');expect(advance(life)).toBe(life);
  }
});
test('completed summaries are capped at twenty and do not duplicate',()=>{
  let save=emptySave();
  for(let seed=0;seed<25;seed++)save=updateSave(save,finish(seed));
  expect(save.history).toHaveLength(20);
  const old=save.history[0],next=updateSave(save,save.life!);
  expect(next.history).toHaveLength(20);expect(next.history[0]).toEqual(old);
});
test('save validation rejects corrupted shapes and accepts a full replayable life',()=>{
  for(const value of [null,{},[],{version:2}, {version:1,life:{},history:[]}, {version:1,life:null,history:[{}]}])expect(parseSave(value)).toEqual(emptySave());
  const life=finish(124),save=updateSave(emptySave(),life);
  expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save);
  expect(parseSave({...save,life:{...life,rng:NaN}}).life).toBeNull();
  expect(parseSave({...save,life:{...life,log:[null]}}).life).toBeNull();
  expect(parseSave({...save,life:{...life,log:[]}}).life).toBeNull();
});
