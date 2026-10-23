import {ImageResponse} from 'next/og';
import {lifeGuide} from '@/data/life-guide';
export const alt=lifeGuide.imageAlt;
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){
 return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',position:'relative',background:'#141e18',color:'#f0f3e9',padding:70,fontFamily:'sans-serif',overflow:'hidden'}}><div style={{position:'absolute',right:-80,top:50,width:500,height:500,border:'2px solid #55704b',borderRadius:'50%',display:'flex'}}/><div style={{position:'absolute',right:10,top:140,width:320,height:320,border:'2px solid #75975e',borderRadius:'50%',display:'flex'}}/><div style={{position:'absolute',right:145,top:275,width:50,height:50,background:'#d4f86b',borderRadius:'50%',display:'flex'}}/><div style={{display:'flex',flexDirection:'column',width:850,justifyContent:'space-between'}}><div style={{display:'flex',fontSize:22,letterSpacing:4,color:'#d4f86b'}}>GAMEVADO · UNOFFICIAL FAN GUIDE</div><div style={{display:'flex',flexDirection:'column'}}><div style={{display:'flex',fontSize:88,fontWeight:700,letterSpacing:-3,lineHeight:1.1}}>1 in 8 Billion</div><div style={{display:'flex',fontSize:44,marginTop:28,color:'#d4f86b'}}>How to Play &amp; Beginner Tips</div></div><div style={{display:'flex',fontSize:24,color:'#bac9b1'}}>Starting settings · Random birth · Life simulation</div></div></div>,size);
}
