export const WORDS=[
 {word:'صوص',label:'صُوصٌ',spoken:'صُوصٌ',hint:'صَغيرُ الدَّجاجةِ، يَقولُ: صِيص صِيص!',art:'chick',color:'yellow'},
 {word:'بصل',label:'بَصَلٌ',spoken:'بَصَلٌ',hint:'خُضارٌ نُضيفُهُ إلى الطَّعامِ.',art:'onion',color:'pink'},
 {word:'لصوص',label:'لُصُوصٌ',spoken:'لُصُوصٌ',hint:'أشخاصٌ يَأخُذونَ ما لَيْسَ لَهُم. نَحْنُ نُحافِظُ عَلى الأَمانةِ.',art:'thieves',color:'blue'},
 {word:'صنبور',label:'صُنْبُورٌ',spoken:'صُنْبُورٌ',hint:'نَفْتَحُهُ لِيَخْرُجَ الماءُ، ثُمَّ نُغْلِقُهُ.',art:'tap',color:'mint'},
 {word:'صاد',label:'صَادٌ',spoken:'صَادٌ',hint:'هذا اسْمُ الحَرْفِ: ص.',art:'sad',color:'lilac'},
 {word:'صلاة',label:'صَلَاةٌ',spoken:'صَلَاةٌ',hint:'عِبادَةٌ نَتَقَرَّبُ بِها إلى اللهِ.',art:'prayer',color:'peach'}
];
export const stripMarks=text=>text.replace(/[\u064b-\u065f\u0670]/gu,'');
export const splitLetters=text=>text.match(/[\u0621-\u064a][\u064b-\u065f\u0670]*/gu)||[];
export function shuffleLetters(word,random=Math.random){
 const result=splitLetters(word).map((label,id)=>({char:stripMarks(label),label,id}));
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 if(result.map(x=>x.label).join('')===word)result.push(result.shift());
 return result;
}
export class WordGame{
 constructor(){this.index=0;this.done=[];this.selected=[];this.letters=shuffleLetters(WORDS[0].label);this.status='playing';this.hinted=false;}
 get current(){return WORDS[this.index];}
 get answerLetters(){return this.selected.map(id=>this.letters.find(x=>x.id===id).label);}
 get vowelledAnswer(){return this.answerLetters.join('');}
 get answer(){return this.selected.map(id=>this.letters.find(x=>x.id===id).char).join('');}
 choose(id){if(this.status!=='playing'||this.selected.includes(id))return false;const tile=this.letters.find(x=>x.id===id);if(!tile)return false;this.selected.push(id);return true;}
 undo(){if(this.status==='playing')this.selected.pop();}
 clear(){if(this.status==='playing')this.selected=[];}
 hint(){if(this.status!=='playing')return;this.hinted=true;const target=splitLetters(this.current.label);let valid=0;while(valid<this.selected.length&&this.answerLetters[valid]===target[valid])valid++;this.selected=this.selected.slice(0,valid);if(valid<target.length){const tile=this.letters.find(t=>t.label===target[valid]&&!this.selected.includes(t.id));this.selected.push(tile.id);}}
 check(){if(this.status!=='playing'||this.selected.length!==this.current.word.length)return null;if(this.vowelledAnswer!==this.current.label)return false;this.status='correct';this.done.push(this.current.word);return true;}
 next(){if(this.status!=='correct')return false;if(this.index===WORDS.length-1){this.status='finished';return true;}this.index++;this.selected=[];this.hinted=false;this.letters=shuffleLetters(this.current.label);this.status='playing';return true;}
}
