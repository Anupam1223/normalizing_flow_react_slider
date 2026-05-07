import { ArrowDown, ArrowRightLeft, Cpu, Zap } from 'lucide-react';

export const meta = {
  title: "38. Reimagining the Architecture for Our Dataset",
  subtitle: "End-to-end: Splitting, Conditioning, Swapping, and Loss.",
};

export default function Section38() {
  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-gray-700 text-base">
         Here is the complete architectural diagram for your Stochastic MPC project. Scroll down to trace the data from the SCADA sensors all the way to the final Loss calculation!
      </p>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl overflow-y-auto h-[450px] relative font-mono">
         
         {/* STEP 1 */}
         <div className="flex flex-col items-center w-full mb-12">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6 shadow-md">1. The 3-Way Partition & Split</span>
            
            <div className="flex justify-center gap-8 w-full text-center">
               <div className="flex flex-col gap-4 w-1/3">
                  <div className="bg-blue-900/50 border border-blue-500/50 p-4 rounded-xl text-blue-200 shadow-lg">
                     <span className="font-bold text-sm block mb-1">x (Measured)</span>
                     <span className="text-xs opacity-80">e.g. Current Temp</span>
                  </div>
                  <div className="bg-amber-900/50 border border-amber-500/50 p-4 rounded-xl text-amber-200 shadow-lg">
                     <span className="font-bold text-sm block mb-1">u (Controls)</span>
                     <span className="text-xs opacity-80">e.g. Shaft Speed</span>
                  </div>
               </div>

               <div className="flex flex-col items-center w-1/3">
                  <div className="bg-rose-600 text-white p-4 rounded-xl text-sm font-bold w-full shadow-lg mb-4 border border-rose-500">
                     θ (Uncertain Future)
                  </div>
                  <ArrowDown size={24} className="text-rose-500 mb-4"/>
                  <div className="flex gap-4 w-full">
                     <div className="bg-rose-400/20 text-rose-300 py-3 rounded-lg text-sm font-bold flex-1 border border-rose-400/50 shadow-inner">θ₁ (Half A)</div>
                     <div className="bg-rose-400/20 text-rose-300 py-3 rounded-lg text-sm font-bold flex-1 border border-rose-400/50 shadow-inner">θ₂ (Half B)</div>
                  </div>
               </div>
            </div>
         </div>

         {/* STEP 2: LAYER 1 */}
         <div className="flex flex-col items-center w-full mb-12 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6">2. Coupling Layer 1</span>
            
            <div className="flex justify-center gap-10 w-full">
               <div className="w-1/2 flex flex-col items-center relative">
                  <div className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-3">
                    <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-3 py-1.5 rounded-lg shadow-sm">θ₁</span> <span className="text-slate-500">+</span> 
                    <span className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg shadow-sm">x</span> <span className="text-slate-500">+</span> 
                    <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-lg shadow-sm">u</span>
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-indigo-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full">
                     <Cpu size={24} className="text-indigo-400 mb-2"/>
                     <span className="text-sm text-white font-bold tracking-wide">Residual MLP 1</span>
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mt-3 mb-3"/>
                  <div className="flex gap-4">
                     <span className="bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">t₁</span>
                     <span className="bg-teal-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">s₁</span>
                  </div>
               </div>

               <div className="w-1/3 flex flex-col items-center">
                  <div className="text-sm font-bold text-rose-300 mb-4 bg-rose-500/20 border border-rose-500/50 px-6 py-1.5 rounded-lg shadow-sm">θ₂</div>
                  <ArrowDown size={20} className="text-rose-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-rose-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full">
                     <span className="text-sm text-white font-bold mb-2">Affine Math</span>
                     <code className="text-xs text-rose-200 bg-slate-900 px-2 py-1 rounded">θ₂ ⊙ exp(s₁) + t₁</code>
                  </div>
                  <ArrowDown size={20} className="text-rose-500 mt-3 mb-3"/>
                  <span className="bg-rose-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Y₂</span>
               </div>
            </div>
         </div>

         {/* STEP 3: THE SWAP */}
         <div className="flex flex-col items-center w-full mb-12">
            <div className="flex items-center gap-6 bg-indigo-900/20 px-8 py-5 rounded-2xl border border-indigo-500/30 shadow-lg">
               <span className="bg-rose-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md">Y₂</span>
               <div className="flex flex-col items-center px-4">
                  <span className="text-xs text-indigo-300 font-bold mb-2 tracking-wider bg-indigo-950 px-2 py-1 rounded">torch.flip()</span>
                  <ArrowRightLeft size={28} className="text-indigo-400"/>
               </div>
               <span className="bg-rose-400/20 border border-rose-500/50 text-rose-300 px-5 py-2 rounded-lg text-sm font-bold shadow-md">θ₁</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-sans italic">The arrays cross over! Y₂ becomes the new Half A.</p>
         </div>

         {/* STEP 4: LAYER 2 */}
         <div className="flex flex-col items-center w-full mb-12 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6">3. Coupling Layer 2</span>
            
            <div className="flex justify-center gap-10 w-full">
               <div className="w-1/2 flex flex-col items-center relative">
                  <div className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-3">
                    <span className="bg-rose-500 border border-rose-600 text-white px-3 py-1.5 rounded-lg shadow-sm">Y₂</span> <span className="text-slate-500">+</span> 
                    <span className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg shadow-sm">x</span> <span className="text-slate-500">+</span> 
                    <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-lg shadow-sm">u</span>
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-indigo-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full">
                     <Cpu size={24} className="text-indigo-400 mb-2"/>
                     <span className="text-sm text-white font-bold tracking-wide">Residual MLP 2</span>
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mt-3 mb-3"/>
                  <div className="flex gap-4">
                     <span className="bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">t₂</span>
                     <span className="bg-teal-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-md">s₂</span>
                  </div>
               </div>

               <div className="w-1/3 flex flex-col items-center">
                  <div className="text-sm font-bold text-rose-300 mb-4 bg-rose-400/20 border border-rose-500/50 px-6 py-1.5 rounded-lg shadow-sm">θ₁</div>
                  <ArrowDown size={20} className="text-rose-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-rose-500 p-5 rounded-xl flex flex-col items-center shadow-xl w-full">
                     <span className="text-sm text-white font-bold mb-2">Affine Math</span>
                     <code className="text-xs text-rose-200 bg-slate-900 px-2 py-1 rounded">θ₁ ⊙ exp(s₂) + t₂</code>
                  </div>
                  <ArrowDown size={20} className="text-rose-500 mt-3 mb-3"/>
                  <span className="bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Z₂</span>
               </div>
            </div>
         </div>

         {/* STEP 5: FINAL OUTPUT & LOSS */}
         <div className="flex flex-col items-center w-full pb-4">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6 shadow-md">4. Final Output & Loss</span>
            
            <div className="flex items-center gap-4 mb-6">
               <span className="text-white text-sm font-bold">Z_final = </span>
               <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm flex gap-3 border-2 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.5)] font-bold">
                  <span>Y₂</span>
                  <span className="border-l-2 border-indigo-400 pl-3">Z₂</span>
               </div>
            </div>

            <div className="bg-slate-800/80 w-full p-6 rounded-2xl border border-slate-600 shadow-2xl">
               <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-sans font-medium">Blueprint Score:</span>
                     <code className="text-indigo-300 bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-500/30">gaussian.log_prob(Z_final)</code>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-sans font-medium">Volume Penalty:</span>
                     <code className="text-teal-300 bg-teal-950 px-3 py-1.5 rounded-lg border border-teal-500/30">sum(s₁) + sum(s₂)</code>
                  </div>
                  <div className="border-t border-slate-600 my-2"></div>
                  <div className="flex justify-between items-center text-base font-bold">
                     <span className="text-rose-400 font-sans">Final Loss:</span>
                     <code className="text-white bg-rose-900/60 border border-rose-500 px-3 py-1.5 rounded-lg shadow-inner">-1 * (Score + Penalty)</code>
                  </div>
               </div>
            </div>
            
            <div className="mt-6 bg-emerald-900/30 border border-emerald-500/50 px-6 py-3 rounded-xl text-emerald-300 text-sm font-bold flex items-center gap-2 shadow-lg font-sans">
               <Zap size={18} className="text-emerald-400"/> loss.backward() updates MLP 1 and MLP 2 simultaneously!
            </div>
         </div>

      </div>
    </div>
  );
}
