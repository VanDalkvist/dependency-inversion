import { useEffect, useReducer } from "react";
import type { StoryDefinition } from "./contracts";
import { createPlayback, playback } from "./playback";
export function usePlayback(story:StoryDefinition){
 const [state,dispatch]=useReducer((s:ReturnType<typeof createPlayback>,e:Parameters<typeof playback>[2])=>playback(story,s,e),undefined,createPlayback);
 useEffect(()=>{
  if(!state.playing)return;
  const timer=window.setInterval(()=>dispatch({type:"tick",ms:100}),100);
  return()=>window.clearInterval(timer);
 },[state.playing,story]);
 useEffect(()=>{
  function keys(event:KeyboardEvent){
   const target=event.target as HTMLElement;
   if(event.altKey||event.ctrlKey||event.metaKey||target.closest("button,a,input,select,textarea,summary,[role=button],[contenteditable=true]"))return;
   if(event.code==="Space"){event.preventDefault();dispatch({type:state.playing?"pause":"play"});}
   if(event.code==="ArrowRight"){event.preventDefault();dispatch({type:"next"});}
   if(event.code==="ArrowLeft"){event.preventDefault();dispatch({type:"previous"});}
  }
  function visibility(){if(document.hidden)dispatch({type:"pause"});}
  window.addEventListener("keydown",keys);document.addEventListener("visibilitychange",visibility);
  return()=>{window.removeEventListener("keydown",keys);document.removeEventListener("visibilitychange",visibility);};
 },[state.playing]);
 return {state,dispatch,scene:story.scenes[state.index]};
}
