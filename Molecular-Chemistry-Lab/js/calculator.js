window.ATOMIC_MASS=Object.fromEntries(ELEMENTS.map(e=>[e.s,e.m]));
window.parseFormula=function(formula){
  const clean=formula.replace(/\s+/g,"");
  if(!/^(?:[A-Z][a-z]?\d*)+$/.test(clean)) throw new Error("Use a formula such as H2O or CO2.");
  const parts=[...clean.matchAll(/([A-Z][a-z]?)(\d*)/g)], counts={};
  for(const m of parts){if(!(m[1] in ATOMIC_MASS)) throw new Error(`Element ${m[1]} is not in this calculator.`); counts[m[1]]=(counts[m[1]]||0)+(m[2]?Number(m[2]):1)}
  return counts;
};
window.molarMass=function(formula){const c=parseFormula(formula);return Object.entries(c).reduce((s,[e,n])=>s+ATOMIC_MASS[e]*n,0)};
window.runCalculation=function(type){
  const get=id=>document.getElementById(id);
  try{
    if(type==="mass"){const f=get("massFormula").value.trim();if(!f)throw Error("Enter a formula.");get("massResult").textContent=`Molar mass = ${molarMass(f).toFixed(3)} g/mol`}
    if(type==="moles"){const m=+get("molesMass").value,mm=+get("molesMM").value;if(!(m>=0&&mm>0))throw Error("Enter positive mass and molar mass.");get("molesResult").textContent=`n = ${(m/mm).toFixed(4)} mol`}
    if(type==="molarity"){const n=+get("molarMoles").value,v=+get("molarVolume").value;if(!(n>=0&&v>0))throw Error("Enter valid moles and volume.");get("molarResult").textContent=`M = ${(n/v).toFixed(4)} mol/L`}
    if(type==="density"){const m=+get("densityMass").value,v=+get("densityVolume").value;if(!(m>=0&&v>0))throw Error("Enter valid mass and volume.");get("densityResult").textContent=`ρ = ${(m/v).toFixed(4)} g/mL`}
    if(type==="composition"){const f=get("compositionFormula").value.trim(),e=get("compositionElement").value.trim();const c=parseFormula(f),mm=molarMass(f);if(!c[e])throw Error("That element is not present in the formula.");get("compositionResult").textContent=`${e} = ${(ATOMIC_MASS[e]*c[e]/mm*100).toFixed(2)}%`}
  }catch(err){const id={mass:"massResult",moles:"molesResult",molarity:"molarResult",density:"densityResult",composition:"compositionResult"}[type];get(id).textContent=`⚠ ${err.message}`}
};