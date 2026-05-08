import React, { useState, useEffect } from 'react';
import { 
  GitMerge, 
  ChevronRight, 
  ChevronLeft, 
  Activity,
  Maximize2,
  Cpu,
  Waves,
  MousePointer2,
  BoxSelect,
  Filter,
  ArrowRight,
  TrendingUp,
  Network,
  Search,
  Ruler,
  Divide
} from 'lucide-react';

export const meta = {
  title: "39. Neural Spline Flows",
  subtitle: "Deconstructing Monotonic Rational-Quadratic Transforms"
};


// ==========================================
// INTERACTIVE VISUAL COMPONENTS
// ==========================================

const VisualButton = ({ onClick, disabled, children, active }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 z-10 ${
      active 
        ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-900/50' 
        : 'bg-slate-700 hover:bg-slate-600 text-slate-200 shadow-slate-900/50 border border-slate-600'
    }`}
  >
    {children}
  </button>
);

// 1. Affine vs Spline
const AnimatedAffineLimitation = () => {
  const [isAffine, setIsAffine] = useState(true);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      <div className="text-xs text-slate-400 mb-8 font-mono text-center">
        {isAffine ? "Affine Transform: g(x) = αx + β" : "Spline Transform: Piecewise Bending"}
      </div>

      <div className="relative w-full max-w-sm h-48 border-l border-b border-slate-700 bg-slate-800/30 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500 rounded-full blur-xl"></div>
           <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-rose-500 rounded-full blur-xl"></div>
           <div className="absolute top-4 right-8 w-12 h-12 bg-amber-500 rounded-full blur-xl"></div>
        </div>
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full transition-opacity duration-500 preserveAspectRatio-none ${isAffine ? 'opacity-100' : 'opacity-0'}`}>
           <path d="M 0 100 L 100 0" fill="none" stroke="#facc15" strokeWidth="3" className="drop-shadow-[0_0_8px_#facc15]" />
        </svg>
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full transition-opacity duration-500 preserveAspectRatio-none ${!isAffine ? 'opacity-100' : 'opacity-0'}`}>
           <path d="M 0 100 C 10 90, 20 80, 25 80 C 35 80, 45 60, 50 50 C 60 30, 70 20, 80 20 C 90 20, 95 10, 100 0" fill="none" stroke="#d946ef" strokeWidth="3" className="drop-shadow-[0_0_8px_#d946ef]" />
        </svg>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md h-12 mt-6">
        {isAffine 
          ? "Affine transformations (scaling and shifting) are essentially straight lines. They are mathematically easy to invert, but heavily lack the flexibility needed to model multi-modal industrial distributions." 
          : "Splines generalize Affine transforms by breaking the line into pieces and bending them. This captures complex operating modes perfectly while remaining strictly invertible."}
      </div>

      <div className="absolute bottom-4">
        <VisualButton onClick={() => setIsAffine(!isAffine)} active={!isAffine}>
          {isAffine ? "Upgrade to Spline Transform" : "Show Affine Limitation"}
        </VisualButton>
      </div>
    </div>
  );
};

// 2. The Architecture (Figure 1 Left)
const AnimatedArchitecture = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        The Bounding Box and K Bins
      </div>

      <div className="relative w-64 h-64 bg-slate-800/30 flex items-center justify-center p-4">
        <svg viewBox="0 0 150 150" className="absolute inset-0 w-full h-full overflow-visible z-0 opacity-50">
           <line x1="-10" y1="160" x2="25" y2="125" stroke="#38bdf8" strokeWidth="2" />
           <line x1="125" y1="25" x2="160" y2="-10" stroke="#38bdf8" strokeWidth="2" />
        </svg>

        <div className="w-[180px] h-[180px] border-[3px] border-dashed border-slate-400/50 relative z-10">
           <span className="absolute -left-8 -bottom-4 text-[12px] font-bold text-slate-400">-B</span>
           <span className="absolute -left-12 top-0 text-[12px] font-bold text-slate-400">B</span>
           <span className="absolute -right-4 -bottom-6 text-[12px] font-bold text-slate-400">B</span>
           <span className="absolute -right-8 -bottom-2 text-[12px] font-bold text-slate-400">-B</span>
           
           <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20 pointer-events-none">
              <div className="border-b border-r border-slate-500"></div><div className="border-b border-r border-slate-500"></div><div className="border-b border-r border-slate-500"></div><div className="border-b border-slate-500"></div>
              <div className="border-b border-r border-slate-500"></div><div className="border-b border-r border-slate-500"></div><div className="border-b border-r border-slate-500"></div><div className="border-b border-slate-500"></div>
              <div className="border-b border-r border-slate-500"></div><div className="border-b border-r border-slate-500"></div><div className="border-b border-r border-slate-500"></div><div className="border-b border-slate-500"></div>
              <div className="border-r border-slate-500"></div><div className="border-r border-slate-500"></div><div className="border-r border-slate-500"></div><div></div>
           </div>

           <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 overflow-visible">
              <path 
                d="M 0 100 C 15 90, 20 85, 30 75 C 40 65, 45 65, 55 50 C 65 35, 75 25, 85 15 C 90 10, 95 5, 100 0" 
                fill="none" stroke="#f472b6" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#f472b6]" 
              />
              <circle cx="30" cy="75" r="3" fill="#000" stroke="#f472b6" strokeWidth="1" />
              <circle cx="55" cy="50" r="3" fill="#000" stroke="#f472b6" strokeWidth="1" />
              <circle cx="85" cy="15" r="3" fill="#000" stroke="#f472b6" strokeWidth="1" />
              <circle cx="0" cy="100" r="3" fill="#000" stroke="#f472b6" strokeWidth="1" />
              <circle cx="100" cy="0" r="3" fill="#000" stroke="#f472b6" strokeWidth="1" />
           </svg>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        As shown in Figure 1 of the paper, the Spline operates within a bounding box <strong className="text-slate-200">[-B, B]</strong>. It places <strong>K+1 Knots</strong> (the dots) inside the box. Between the knots are <strong>K Bins</strong>. Outside the box, it uses a linear "identity" tail so extreme unconstrained inputs don't crash the math.
      </div>
    </div>
  );
};

// 3. The MLP Output
const AnimatedMLPOutput = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        The MLP Output Layer (Example: K = 5 Bins)
      </div>

      <div className="flex flex-col items-center w-full max-w-md">
         {/* The MLP */}
         <div className="bg-slate-800 border-2 border-indigo-500 px-8 py-3 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)] w-full mb-4">
            <Cpu size={24} className="text-indigo-400 mr-3"/>
            <div className="flex flex-col">
              <span className="text-sm text-white font-bold">Standard Residual MLP</span>
              <span className="text-[10px] text-slate-400">Processes condition (x)</span>
            </div>
         </div>

         <ArrowRight size={20} className="text-slate-500 mb-4 rotate-90" />

         {/* Output Vector */}
         <div className="flex flex-col w-full bg-slate-950 p-4 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 text-center mb-2">Output Layer: (3 * K) - 1 Neurons = <strong className="text-white">14 Raw Numbers</strong></div>
            
            <div className="flex w-full gap-2">
               {/* Widths Array */}
               <div className="flex flex-col flex-1 gap-1">
                 <span className="text-[8px] font-bold text-fuchsia-400 text-center">Widths (5)</span>
                 <div className="flex gap-0.5 w-full bg-fuchsia-900/30 p-1 border border-fuchsia-500/30 rounded">
                   {Array.from({length: 5}).map((_,i)=><div key={i} className="h-4 flex-1 bg-fuchsia-500/50 rounded-sm"></div>)}
                 </div>
               </div>

               {/* Heights Array */}
               <div className="flex flex-col flex-1 gap-1">
                 <span className="text-[8px] font-bold text-sky-400 text-center">Heights (5)</span>
                 <div className="flex gap-0.5 w-full bg-sky-900/30 p-1 border border-sky-500/30 rounded">
                   {Array.from({length: 5}).map((_,i)=><div key={i} className="h-4 flex-1 bg-sky-500/50 rounded-sm"></div>)}
                 </div>
               </div>

               {/* Derivatives Array */}
               <div className="flex flex-col flex-1 gap-1">
                 <span className="text-[8px] font-bold text-emerald-400 text-center">Derivatives (4)</span>
                 <div className="flex gap-0.5 w-full bg-emerald-900/30 p-1 border border-emerald-500/30 rounded">
                   {Array.from({length: 4}).map((_,i)=><div key={i} className="h-4 flex-1 bg-emerald-500/50 rounded-sm"></div>)}
                 </div>
               </div>
            </div>
         </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-8 bg-slate-800/50 p-3 rounded border border-slate-700">
        Yes, the MLP is a completely normal neural network! However, instead of outputting just a single prediction, the final layer has <strong>(3K - 1)</strong> neurons. We simply slice this long array of raw numbers into three distinct arrays: Widths, Heights, and Derivatives.
      </div>
    </div>
  );
};

// 4. The Activation Functions (Softmax & Softplus constraints)
const AnimatedConstraints = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Enforcing Physical Constraints via Activations
      </div>

      <div className="flex flex-col gap-6 w-full max-w-md">
         
         {/* Softmax Constraint */}
         <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex flex-col w-1/3 text-center gap-1">
              <span className="text-[10px] font-bold text-fuchsia-400">Raw W & H</span>
              <span className="text-[8px] text-slate-400">Can be negative or huge</span>
            </div>
            
            <div className="flex flex-col items-center justify-center w-1/3">
              <div className="bg-indigo-900/50 border border-indigo-500 text-[9px] text-indigo-300 font-mono px-2 py-1 rounded">Softmax() * 2B</div>
              <ArrowRight size={14} className="text-slate-500 mt-1"/>
            </div>

            <div className="flex flex-col w-1/3">
              <div className="w-full h-4 border-l-2 border-r-2 border-slate-400 relative flex mb-1">
                 <div className="h-full bg-fuchsia-500/80 w-[20%] border-r border-slate-900"></div>
                 <div className="h-full bg-fuchsia-500/80 w-[50%] border-r border-slate-900"></div>
                 <div className="h-full bg-fuchsia-500/80 w-[30%]"></div>
                 <span className="absolute -top-4 left-0 text-[8px] text-slate-400 -translate-x-1/2">-B</span>
                 <span className="absolute -top-4 right-0 text-[8px] text-slate-400 translate-x-1/2">B</span>
              </div>
              <span className="text-[8px] text-slate-400 text-center leading-tight">Must sum exactly to Bounding Box width (2B)</span>
            </div>
         </div>

         {/* Softplus Constraint */}
         <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex flex-col w-1/3 text-center gap-1">
              <span className="text-[10px] font-bold text-emerald-400">Raw Derivatives</span>
              <span className="text-[8px] text-slate-400">Negative = Downward curve</span>
            </div>
            
            <div className="flex flex-col items-center justify-center w-1/3">
              <div className="bg-emerald-900/50 border border-emerald-500 text-[9px] text-emerald-300 font-mono px-2 py-1 rounded">Softplus()</div>
              <ArrowRight size={14} className="text-slate-500 mt-1"/>
            </div>

            <div className="flex flex-col w-1/3 items-center justify-center relative">
               <TrendingUp size={24} className="text-emerald-400" />
               <span className="text-[8px] text-slate-400 text-center leading-tight mt-2">Always &gt; 0<br/>(Strictly Monotonic)</span>
            </div>
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        <strong>Softmax</strong> turns raw numbers into percentages (0 to 1) that sum to 1. By multiplying by 2B, we guarantee the bins fit <i>perfectly</i> inside the box without spilling over. <strong>Softplus</strong> smoothly forces any number to be positive (greater than 0). This is required because if a slope becomes negative, the curve dips down, destroying mathematical invertibility!
      </div>
    </div>
  );
};

// 5. Constructing the Geometry (Cumulative Sum)
const AnimatedKnotBuilding = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setStep(prev => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Building Knots via Cumulative Sums
      </div>

      <div className="relative w-48 h-48 border-2 border-dashed border-slate-500/50 bg-slate-800/30 flex items-end">
         <span className="absolute -left-6 bottom-0 text-[10px] text-slate-400">(-B, -B)</span>
         
         <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle cx="0" cy="100" r="3" fill="#fff" />
            
            {step >= 1 && (
              <g className="animate-in fade-in duration-300">
                <line x1="0" y1="100" x2="30" y2="100" stroke="#c026d3" strokeWidth="1.5" strokeDasharray="2" />
                <text x="15" y="106" fill="#c026d3" fontSize="6">W1</text>
                
                <line x1="30" y1="100" x2="30" y2="70" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2" />
                <text x="32" y="85" fill="#0284c7" fontSize="6">H1</text>
                <circle cx="30" cy="70" r="3" fill="#10b981" />
              </g>
            )}

            {step >= 2 && (
              <g className="animate-in fade-in duration-300">
                <line x1="30" y1="70" x2="70" y2="70" stroke="#c026d3" strokeWidth="1.5" strokeDasharray="2" />
                <text x="50" y="76" fill="#c026d3" fontSize="6">W2</text>
                
                <line x1="70" y1="70" x2="70" y2="20" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2" />
                <text x="72" y="45" fill="#0284c7" fontSize="6">H2</text>
                <circle cx="70" cy="20" r="3" fill="#10b981" />
              </g>
            )}

            {step >= 3 && (
              <g className="animate-in fade-in duration-300">
                <line x1="70" y1="20" x2="100" y2="20" stroke="#c026d3" strokeWidth="1.5" strokeDasharray="2" />
                <line x1="100" y1="20" x2="100" y2="0" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2" />
                <circle cx="100" cy="0" r="3" fill="#10b981" />
              </g>
            )}

            {step >= 4 && (
              <path 
                d="M 0 100 C 10 90, 20 80, 30 70 C 50 60, 60 50, 70 20 C 80 5, 90 2, 100 0" 
                fill="none" stroke="#f472b6" strokeWidth="2.5" className="animate-in fade-in duration-1000 drop-shadow-[0_0_6px_#f472b6]" 
              />
            )}
         </svg>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-8">
        Once we have the valid Widths and Heights, we use <strong>Cumulative Sums (torch.cumsum)</strong> starting from the bottom-left corner (-B, -B). Adding Width 1 and Height 1 gives us the exact coordinates of Knot 1. We repeat this to build all Knots.
      </div>
    </div>
  );
};

// 6. Binary Search
const AnimatedBinarySearch = () => {
  const [searchStep, setSearchStep] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setSearchStep(prev => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Step 1: Finding the Bin (Binary Search)
      </div>

      <div className="relative w-full max-w-md bg-slate-800/40 p-6 rounded-xl border border-slate-700 overflow-hidden flex flex-col items-center">
        
        <div className="text-[10px] text-fuchsia-300 font-bold mb-4">Input Data Point: x = 2.4</div>
        
        {/* Number line with 8 bins */}
        <div className="relative w-full h-8 flex border-b-2 border-slate-500 mb-4">
           {Array.from({length: 8}).map((_, i) => {
             // Determine if this bin is active in the current search step
             let isActive = false;
             if (searchStep === 0) isActive = true; // Search all
             if (searchStep === 1 && i >= 4) isActive = true; // Search right half
             if (searchStep === 2 && i >= 4 && i < 6) isActive = true; // Search left quarter of right half
             if (searchStep === 3 && i === 5) isActive = true; // Found it!

             return (
               <div key={i} className="flex-1 border-r border-slate-600 relative flex items-end justify-center pb-1">
                 <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-fuchsia-500/20' : 'bg-transparent'}`}></div>
                 {isActive && searchStep === 3 && <div className="absolute inset-0 bg-fuchsia-500/40 border-2 border-fuchsia-400 rounded-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>}
                 <span className="text-[8px] text-slate-500">B{i+1}</span>
               </div>
             )
           })}
           
           {/* Target Arrow */}
           <div className="absolute top-0 bottom-0 border-l-[3px] border-fuchsia-400 transition-all duration-300 shadow-[0_0_8px_#e879f9]" style={{ left: '68%' }}></div>
           <div className="absolute -top-4 text-[10px] font-bold text-fuchsia-400 transition-all duration-300" style={{ left: '68%', transform: 'translateX(-50%)' }}>x</div>
        </div>

        <div className="flex gap-2 w-full text-[10px] font-mono text-center">
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 0 ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}>Search [0, 8]</div>
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 1 ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}>Search [4, 8]</div>
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 2 ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}>Search [4, 6]</div>
           <div className={`flex-1 p-2 rounded border transition-colors ${searchStep === 3 ? 'bg-fuchsia-900/50 border-fuchsia-500 text-fuchsia-300' : 'border-slate-800 text-slate-500'}`}>Found Bin 6!</div>
        </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        When a new data point (x) arrives, the flow must determine which of the K bins it belongs to. Because the knots are strictly ordered, PyTorch uses a highly optimized <strong>Binary Search (torch.searchsorted)</strong> to find the correct bin in log(K) time.
      </div>
    </div>
  );
};

// 7. Local Coordinates
const AnimatedLocalCoordinates = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;
    let time = 0;
    const animate = () => {
      time += 0.02;
      // Oscillate between 0 and 1 using sine wave
      const val = (Math.sin(time) + 1) / 2;
      setProgress(val);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Step 2: Local Coordinates (ξ)
      </div>

      <div className="relative w-full max-w-md bg-slate-800/40 p-6 pt-10 rounded-xl border border-slate-700 flex flex-col items-center">
         
         <div className="absolute top-3 left-4 text-[10px] text-slate-400 font-mono">Zoomed in on Bin k</div>

         {/* The Bin Space */}
         <div className="relative w-[80%] h-12 border-b-2 border-l-2 border-r-2 border-slate-500 mb-6">
            <span className="absolute -bottom-5 left-0 text-[10px] text-slate-400 -translate-x-1/2">Start (x_k)</span>
            <span className="absolute -bottom-5 right-0 text-[10px] text-slate-400 translate-x-1/2">End (x_k+1)</span>
            
            <div className="absolute top-1/2 w-full text-center text-[10px] text-slate-500 font-bold -translate-y-1/2">Bin Width (W_k)</div>

            {/* Moving X point */}
            <div className="absolute top-0 bottom-0 border-l-[3px] border-sky-400" style={{ left: `${progress * 100}%` }}></div>
            <div className="absolute -top-6 text-[12px] font-bold text-sky-400 bg-slate-900 px-1 rounded" style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }}>x</div>
         </div>

         {/* The ξ Progress Bar */}
         <div className="w-[80%] flex items-center gap-4 mt-4">
            <span className="text-[12px] font-bold text-sky-400">ξ = </span>
            <div className="flex-1 h-4 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
               <div className="h-full bg-sky-500" style={{ width: `${progress * 100}%` }}></div>
            </div>
            <span className="text-[10px] font-mono text-slate-300 w-8">{progress.toFixed(2)}</span>
         </div>

         <div className="mt-6 bg-slate-900 border border-slate-700 px-4 py-2 rounded text-[10px] text-sky-300 font-mono">
            ξ = (x - x_k) / W_k
         </div>

      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-6">
        We don't use absolute SCADA values to evaluate the curve. Instead, we convert the point <strong>x</strong> into a fractional distance across the bin, called <strong>ξ (xi)</strong>. It is exactly 0.0 at the left edge and 1.0 at the right edge.
      </div>
    </div>
  );
};

// 8. The Math Formula
const AnimatedRQMath = () => {
  const [direction, setDirection] = useState('forward');

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Step 3: Evaluating the Rational-Quadratic Formula
      </div>

      <div className="flex items-center justify-center gap-6 w-full max-w-lg bg-slate-800/40 p-6 rounded-xl border border-slate-700">
         
         {/* Visual of a single bin */}
         <div className="relative w-32 h-32 border-l-2 border-b-2 border-slate-500">
            {/* Axis labels */}
            <span className="absolute -bottom-4 right-0 text-[10px] text-sky-400 font-bold">ξ</span>
            <span className="absolute -left-4 top-0 text-[10px] text-fuchsia-400 font-bold">y</span>

            {/* The Curve */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
               <path d="M 0 100 C 40 85, 70 40, 100 0" fill="none" stroke="#64748b" strokeWidth="3" />
               
               {direction === 'forward' ? (
                 <g className="animate-in fade-in duration-500">
                   {/* Forward projection */}
                   <line x1="60" y1="100" x2="60" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3" className="animate-pulse" />
                   <line x1="60" y1="40" x2="0" y2="40" stroke="#f472b6" strokeWidth="2" strokeDasharray="3" />
                   <circle cx="60" cy="40" r="4" fill="#fff" className="shadow-[0_0_10px_#fff]" />
                 </g>
               ) : (
                 <g className="animate-in fade-in duration-500">
                   {/* Inverse projection */}
                   <line x1="0" y1="40" x2="60" y2="40" stroke="#f472b6" strokeWidth="2" strokeDasharray="3" className="animate-pulse" />
                   <line x1="60" y1="40" x2="60" y2="100" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3" />
                   <circle cx="60" cy="40" r="4" fill="#fff" className="shadow-[0_0_10px_#fff]" />
                 </g>
               )}
            </svg>
         </div>

         {/* Equation Text */}
         <div className="flex flex-col gap-4 flex-1">
            <div className={`p-4 rounded-xl border transition-all duration-300 ${direction === 'forward' ? 'bg-slate-900 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Forward (Training)</span><br/>
               <span className="text-slate-200 text-sm font-mono mt-1 block">y = <span className="text-sky-400">α(ξ)</span> / <span className="text-sky-400">β(ξ)</span></span>
               <span className="text-[9px] text-slate-500 mt-2 block">Directly calculates y from ξ using quadratic polynomials.</span>
            </div>
            
            <div className={`p-4 rounded-xl border transition-all duration-300 ${direction === 'inverse' ? 'bg-slate-900 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Inverse (Sampling)</span><br/>
               <span className="text-slate-200 text-sm font-mono mt-1 block">a<span className="text-fuchsia-400">ξ²</span> + b<span className="text-fuchsia-400">ξ</span> + c = 0</span>
               <span className="text-[9px] text-slate-500 mt-2 block">Mathematically rearranges the formula to solve for the exact roots of ξ given y.</span>
            </div>
         </div>

      </div>

      <div className="absolute bottom-4 flex gap-4">
        <VisualButton onClick={() => setDirection('forward')} active={direction === 'forward'}>
          Forward (x → y)
        </VisualButton>
        <VisualButton onClick={() => setDirection('inverse')} active={direction === 'inverse'}>
          Inverse (y → x)
        </VisualButton>
      </div>
    </div>
  );
};

// 9. The Jacobian Derivative (Figure 1 Right)
const AnimatedJacobian = () => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-6">
      
      <div className="text-xs text-slate-400 mb-4 font-mono text-center">
        The Jacobian Determinant: g'(x)
      </div>

      <div className="relative w-full max-w-md h-56 border-l border-b border-slate-600 bg-slate-800/30 overflow-hidden flex items-end">
        <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">1</span>
        <span className="absolute -left-3 bottom-0 text-[10px] text-slate-400">0</span>

        <span className="absolute bottom-2 left-[20%] -translate-x-1/2 text-[10px] text-slate-400">-B</span>
        <span className="absolute bottom-2 left-[50%] -translate-x-1/2 text-[10px] text-slate-400">0</span>
        <span className="absolute bottom-2 left-[80%] -translate-x-1/2 text-[10px] text-slate-400">B</span>

        <div className="absolute top-1/2 w-full border-t border-dashed border-slate-500/50 z-0"></div>
        <div className="absolute top-0 bottom-0 left-[20%] border-l border-dashed border-slate-500/50 z-0"></div>
        <div className="absolute top-0 bottom-0 left-[80%] border-l border-dashed border-slate-500/50 z-0"></div>

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible preserveAspectRatio-none z-10">
           <path d="M 0 100 L 0 50 L 20 50 C 25 80, 27 10, 30 50 C 33 90, 35 15, 40 60 C 45 40, 50 80, 55 45 C 60 90, 65 5, 70 70 C 75 40, 78 80, 80 50 L 100 50 L 100 100 Z" fill="rgba(56, 189, 248, 0.2)" />
           <path d="M 0 50 L 20 50 C 25 80, 27 10, 30 50 C 33 90, 35 15, 40 60 C 45 40, 50 80, 55 45 C 60 90, 65 5, 70 70 C 75 40, 78 80, 80 50 L 100 50" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="drop-shadow-[0_0_4px_#38bdf8]" />
        </svg>

      </div>

      <div className="text-[11px] text-slate-400 text-center mt-6 bg-slate-800/50 p-3 rounded border border-slate-700 max-w-md">
        This exactly matches Figure 1 (Right) in the paper. The derivative represents the <strong>Jacobian Determinant</strong>—how much probability is being stretched. Outside the box, it is exactly 1 (no stretch). Inside the box, the massive jagged peaks prove how the Spline expands and compresses space to effortlessly model multi-modal distributions!
      </div>
    </div>
  );
};

// 10. Gaussianization (Data to Latent Space)
const AnimatedGaussianization = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    let int;
    if (isRunning) {
      int = setInterval(() => {
        const rand = Math.random();
        let startX = 0;
        if (rand < 0.3) startX = 15 + Math.random() * 10;
        else if (rand < 0.7) startX = 50 + Math.random() * 20;
        else startX = 85 + Math.random() * 10;

        const newPoint = { id: Date.now(), x: startX, progress: 0 };
        setPoints(curr => [...curr, newPoint].slice(-40));
      }, 150);
    }
    return () => clearInterval(int);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const animationFrame = setInterval(() => {
      setPoints(curr => curr.map(p => {
        if (p.progress >= 100) return p;
        return { ...p, progress: p.progress + 2 };
      }));
    }, 30);
    return () => clearInterval(animationFrame);
  }, [isRunning]);

  const mapXtoY = (x) => {
    if (x < 30) return (x / 30) * 20; 
    if (x < 80) return 20 + ((x - 30) / 50) * 60; 
    return 80 + ((x - 80) / 20) * 20; 
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 pb-16">
      
      <div className="text-xs text-slate-400 mb-6 font-mono text-center">
        Gaussianization: Mapping Complex Data (x) to Latent Space (z)
      </div>

      <div className="relative w-64 h-64 border-l border-b border-slate-600 bg-slate-800/30">
         
         <div className="absolute -bottom-10 left-0 w-full h-8 flex items-end">
            <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
               <path d="M 0 20 C 15 20, 15 5, 20 5 C 25 5, 25 20, 30 20 L 40 20 C 50 20, 55 0, 60 0 C 65 0, 70 20, 80 20 L 80 20 C 85 20, 88 10, 90 10 C 92 10, 95 20, 100 20" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="1" />
            </svg>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-rose-400 font-bold whitespace-nowrap">Complex Data (x)</span>
         </div>

         <div className="absolute top-0 -left-12 w-10 h-full flex items-center">
            <svg viewBox="0 0 20 100" className="w-full h-full overflow-visible">
               <path d="M 0 100 C 0 80, 20 60, 20 50 C 20 40, 0 20, 0 0" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1" />
            </svg>
            <span className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-sky-400 font-bold whitespace-nowrap">Latent Normal (z)</span>
         </div>

         <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible z-10">
            <path d="M 0 100 C 10 95, 25 90, 30 80 C 40 50, 70 50, 80 20 C 85 10, 90 5, 100 0" fill="none" stroke="#d946ef" strokeWidth="2" className="drop-shadow-[0_0_5px_#d946ef]" />
            
            {points.map(p => {
               const targetY = 100 - mapXtoY(p.x);
               let cx, cy, opacity;

               if (p.progress < 40) {
                 cx = p.x;
                 cy = 100 - (p.progress / 40) * (100 - targetY);
                 opacity = p.progress / 40;
               } else if (p.progress < 60) {
                 cx = p.x;
                 cy = targetY;
                 opacity = 1;
               } else {
                 const leftProgress = (p.progress - 60) / 40;
                 cx = p.x - (leftProgress * p.x);
                 cy = targetY;
                 opacity = 1 - leftProgress;
               }

               return (
                 <circle key={p.id} cx={cx} cy={cy} r="1.5" fill="#fff" opacity={opacity} className="shadow-lg" />
               );
            })}
         </svg>
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-md mt-14 h-12">
        This is what the Normalizing Flow actually achieves. It learns to bend the space so that when you feed in messy, 3-peaked SCADA data (x), it flows through the spline and maps perfectly onto a clean, single-peak Standard Gaussian bell curve (z). We call this <strong>Gaussianizing</strong> the data into the Latent Space.
      </div>

      <div className="absolute bottom-4">
        <VisualButton onClick={() => { setIsRunning(!isRunning); setPoints([]); }} active={isRunning}>
          {isRunning ? "Stop Data Flow" : "Flow Data into Latent Space"}
        </VisualButton>
      </div>
    </div>
  );
};


// ==========================================
// MAIN CONFIGURATION & COMPONENT
// ==========================================

const steps = [
  {
    id: 'affine-vs-spline',
    chapter: 'Transform Types',
    title: '1. The Limits of Affine Math',
    icon: GitMerge,
    Visual: AnimatedAffineLimitation,
    description: "Traditionally, flows used Affine transformations (simply shifting and scaling the data). As the authors note, while Affine is mathematically easy to invert, it lacks the flexibility to model discontinuous or multi-modal densities. We need a function that can 'bend' to fit the actual data shape."
  },
  {
    id: 'spline-bounds',
    chapter: 'Rational-Quadratic Splines',
    title: '2. Bounding Boxes and Knots',
    icon: BoxSelect,
    Visual: AnimatedArchitecture,
    description: "To gain flexibility without losing invertibility, Durkan et al. restrict the input domain to an interval [-B, B]. Inside this bounding box, the space is partitioned into K distinct bins defined by K+1 'Knot' points. Outside the box, the function safely defaults to a linear tail."
  },
  {
    id: 'spline-params',
    chapter: 'The Neural Architecture',
    title: '3. The Neural Network Outputs',
    icon: Cpu,
    Visual: AnimatedMLPOutput,
    description: "Yes, 'The Brain' is a completely standard Residual MLP! But instead of outputting just 1 prediction, the final layer outputs a long array of (3K - 1) neurons for every dimension it transforms. We cleanly slice this array into three parts: Widths, Heights, and Derivatives."
  },
  {
    id: 'spline-activations',
    chapter: 'The Neural Architecture',
    title: '4. Enforcing Physical Constraints',
    icon: Network,
    Visual: AnimatedConstraints,
    description: "Neural networks output unbounded raw numbers. We must constrain them so the math doesn't break. Softmax forces the Widths and Heights to sum perfectly to 2B so the curve never leaks outside the bounding box. Softplus forces the slopes to be positive, ensuring the curve never dips down (Strict Monotonicity is required for invertibility)."
  },
  {
    id: 'spline-cumsum',
    chapter: 'Constructing the Spline',
    title: '5. Building the Geometry',
    icon: Activity,
    Visual: AnimatedKnotBuilding,
    description: "Immediately after applying those activation functions, we use cumulative sums (torch.cumsum). Starting from the bottom left corner (-B, -B), we mathematically 'walk' across the grid by adding each bin's Width and Height to find the exact (x, y) coordinates of every Knot."
  },
  {
    id: 'spline-search',
    chapter: 'Evaluating the Curve',
    title: '6. Finding the Bin',
    icon: Search,
    Visual: AnimatedBinarySearch,
    description: "Once the grid of K knots is built, the flow needs to evaluate a specific data point 'x'. Because the knots are strictly ordered from left to right, PyTorch uses a highly optimized Binary Search algorithm to instantly find exactly which bin 'x' falls into."
  },
  {
    id: 'spline-local',
    chapter: 'Evaluating the Curve',
    title: '7. Local Coordinates (ξ)',
    icon: Ruler,
    Visual: AnimatedLocalCoordinates,
    description: "We don't use absolute SCADA values to calculate the math. Once we find the correct bin, we calculate ξ (xi): the fractional distance of x across that specific bin. ξ is always exactly 0.0 at the left knot and 1.0 at the right knot."
  },
  {
    id: 'spline-math',
    chapter: 'Evaluating the Curve',
    title: '8. The Rational-Quadratic Formula',
    icon: Divide,
    Visual: AnimatedRQMath,
    description: "Inside the bin, the curve is mathematically defined as a quotient of two quadratic polynomials. Because the curve is strictly monotonic (always increasing), calculating the exact Inverse (going from y back to x) mathematically simplifies to just solving for the roots of a quadratic equation!"
  },
  {
    id: 'spline-jacobian',
    chapter: 'Mathematical Properties',
    title: '9. Inducing Multi-Modality',
    icon: Waves,
    Visual: AnimatedJacobian,
    description: "The derivative of the spline curve dictates the Jacobian Determinant. As shown in the paper's Figure 1, the derivative stays at 1 outside the box, but exhibits massive peaks and valleys inside the box. These peaks literally compress and expand probability mass, naturally capturing multi-modal operating regimes."
  },
  {
    id: 'gaussianization',
    chapter: 'Putting it Together',
    title: '10. Gaussianizing the Data',
    icon: Filter,
    Visual: AnimatedGaussianization,
    description: "By combining these properties, the Neural Spline acts as a funnel. It takes complex, real-world SCADA distributions and forces them to align with a perfect, easy-to-sample Standard Normal distribution in the latent space. Once trained, we can reverse the flow: sampling simple Gaussian noise to generate hyper-realistic future scenarios."
  }
];

export default function SplineIntuitionSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
        <div className="p-3 bg-fuchsia-100 text-fuchsia-600 rounded-xl shadow-sm border border-fuchsia-200">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Neural Spline Flows</h2>
          <p className="text-sm text-slate-500 font-medium">Deconstructing Monotonic Rational-Quadratic Transforms</p>
        </div>
      </div>

      {/* Chapter Indicator */}
      <div className="w-full flex items-center justify-between mb-2">
         <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-500">{step.chapter}</span>
         <span className="font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200 shadow-sm">
            Concept {currentStep + 1} / {steps.length}
         </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full flex gap-1 mb-6">
        {steps.map((s, idx) => (
          <div 
            key={s.id} 
            onClick={() => setCurrentStep(idx)}
            className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentStep ? 'bg-fuchsia-600 scale-y-125 shadow-[0_0_8px_rgba(192,38,211,0.5)]' : 
              idx < currentStep ? 'bg-fuchsia-300' : 'bg-slate-200 hover:bg-slate-300'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[450px]">
        
        {/* Left Col: Explanations */}
        <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-md flex-shrink-0 border border-slate-700">
              <step.icon size={20} className="text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{step.title}</h3>
          </div>
          
          <div className="text-slate-600 leading-relaxed text-[15px]">
            {step.description}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
             <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
               <MousePointer2 className="text-fuchsia-500 flex-shrink-0 mt-0.5" size={18}/>
               <p className="text-xs text-slate-600 leading-relaxed">
                 The visuals on the right directly recreate the mathematical mechanics and figures detailed in <strong>Section 3: Method</strong> of the Durkan et al. paper.
               </p>
             </div>
          </div>
        </div>

        {/* Right Col: Interactive Visual */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          <div className="flex-1 w-full rounded-2xl shadow-xl overflow-hidden relative border-4 border-slate-900/5 bg-[#0d1117]">
             <step.Visual />
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft size={18} /> Previous Concept
        </button>
        
        <button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-white bg-fuchsia-600 hover:bg-fuchsia-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {currentStep === steps.length - 1 ? 'Finish Exploration' : 'Next Concept'} <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}