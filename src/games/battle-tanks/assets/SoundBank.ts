/** Original deterministic synthesized audio. No downloaded/third-party samples. */
type Cue = 'shot'|'explosion'|'powerup_collect'|'base_hit'|'won'|'lost';
export class SoundBank {
 private samples = new Map<Cue,Float32Array>();
 private context:AudioContext|null=null;
 private buffers = new Map<Cue,AudioBuffer>();
 enabled=true;
 constructor(){
  const recipes:Record<Cue,[number,number,number]>={shot:[120,.08,40],explosion:[70,.32,25],powerup_collect:[480,.2,960],base_hit:[95,.18,45],won:[440,.5,880],lost:[220,.5,75]};
  for(const [name,[from,duration,to]] of Object.entries(recipes)){const length=Math.floor(22050*duration),sample=new Float32Array(length);let phase=0,seed=1;
   for(let i=0;i<length;i++){const fraction=i/length;phase+=2*Math.PI*(from+(to-from)*fraction)/22050;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296*2-1;sample[i]=(Math.sin(phase)*(name==='explosion'?.2:1)+(name==='explosion'?noise*.8:0))*(1-fraction)**2*.22}this.samples.set(name as Cue,sample)
  }
 }
 async unlock(){if(!this.enabled)return;try{this.context??=new AudioContext();if(!this.buffers.size)for(const [name,samples] of this.samples){const buffer=this.context.createBuffer(1,samples.length,22050);buffer.getChannelData(0).set(samples);this.buffers.set(name,buffer)}await this.context.resume()}catch{/* Silent mode remains playable. */}}
 play(name:string){if(!this.enabled||this.context?.state!=='running')return;const buffer=this.buffers.get(name as Cue);if(!buffer)return;try{const source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.context.destination);source.start()}catch{}}
 close(){void this.context?.close().catch(()=>{});this.context=null;this.buffers.clear()}
}
