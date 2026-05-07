export const meta = {
  title: "39. PyTorch UML Class Diagram",
  subtitle: "Object-oriented dependencies, inheritance, and composition.",
};

export default function Section39() {
  return (
    <div className="space-y-4 animate-fade-in w-full max-w-4xl mx-auto">
      <p className="text-gray-700 text-sm mb-2">
        To scale this for edge deployment, the system is strictly modular. The diagram below illustrates how our PyTorch components inherit from <code>nn.Module</code> and compose together using <strong>Aggregation/Composition</strong> (filled diamonds) and <strong>Inheritance</strong> (empty triangles).
      </p>

      <div className="bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-700 shadow-xl overflow-x-auto flex justify-center w-full">
         
         <div className="relative w-[800px] h-[480px] shrink-0 font-mono text-slate-300 mx-auto">
            
            {/* SVG LINES & MARKERS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               <defs>
                  <marker id="uml-inheritance" markerWidth="14" markerHeight="14" refX="14" refY="7" orient="auto">
                     <path d="M 0 0 L 14 7 L 0 14 Z" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
                  </marker>
                  <marker id="uml-composition" markerWidth="14" markerHeight="14" refX="0" refY="7" orient="auto">
                     <path d="M 0 7 L 7 0 L 14 7 L 7 14 Z" fill="#cbd5e1" stroke="#cbd5e1" strokeWidth="1" />
                  </marker>
               </defs>

               {/* INHERITANCE LINES */}
               <path d="M 130 160 L 130 110 L 400 110 L 400 84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#uml-inheritance)" />
               <path d="M 400 160 L 400 84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#uml-inheritance)" />
               <path d="M 670 160 L 670 110 L 400 110 L 400 84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#uml-inheritance)" />

               {/* COMPOSITION LINES */}
               <path d="M 250 280 L 280 280" fill="none" stroke="#cbd5e1" strokeWidth="1.5" markerStart="url(#uml-composition)" />
               <path d="M 520 280 L 550 280" fill="none" stroke="#cbd5e1" strokeWidth="1.5" markerStart="url(#uml-composition)" />
            </svg>

            {/* 1. Base PyTorch Module */}
            <div className="absolute top-[20px] left-[320px] w-[160px] bg-slate-800 border border-slate-500 rounded shadow-lg z-10 flex flex-col text-center">
               <div className="bg-slate-700 py-1 border-b border-slate-500 rounded-t">
                  <span className="block text-[9px] text-slate-400">&lt;&lt;pytorch&gt;&gt;</span>
                  <strong className="text-white text-xs">nn.Module</strong>
               </div>
            </div>

            {/* 2. PipelineConditionalFlow */}
            <div className="absolute top-[160px] left-[10px] w-[240px] bg-indigo-950/40 border border-indigo-500 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.2)] z-10 flex flex-col text-[10px]">
               <div className="bg-indigo-900/80 py-2 border-b border-indigo-500 rounded-t-lg text-center">
                  <span className="block text-[9px] text-indigo-300">&lt;&lt;wrapper_class&gt;&gt;</span>
                  <strong className="text-white text-xs">PipelineConditionalFlow</strong>
               </div>
               <div className="p-3 border-b border-indigo-800/50 space-y-1">
                  <p className="text-indigo-200">+ dim_theta: <span className="text-slate-400">int</span></p>
                  <p className="text-indigo-200">+ blueprint_loc: <span className="text-slate-400">Tensor</span></p>
                  <p className="text-indigo-200">+ blueprint_cov: <span className="text-slate-400">Tensor</span></p>
                  <p className="text-indigo-200">+ layers: <span className="text-slate-400">nn.ModuleList</span></p>
               </div>
               <div className="p-3 space-y-1 text-slate-300">
                  <p>+ __init__(t, c, n_layers)</p>
                  <p>+ get_blueprint(): <span className="text-slate-400">Normal</span></p>
                  <p className="font-bold text-white">+ forward(θ, cond)</p>
                  <p className="font-bold text-white">+ compute_loss(θ, cond)</p>
                  <p>+ sample(num_samples, cond)</p>
               </div>
            </div>

            {/* 3. ConditionalAffineCouplingLayer */}
            <div className="absolute top-[160px] left-[280px] w-[240px] bg-rose-950/40 border border-rose-500 rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.2)] z-10 flex flex-col text-[10px]">
               <div className="bg-rose-900/80 py-2 border-b border-rose-500 rounded-t-lg text-center">
                  <span className="block text-[9px] text-rose-300">&lt;&lt;flow_layer&gt;&gt;</span>
                  <strong className="text-white text-xs truncate px-2 block">ConditionalAffineCouplingLayer</strong>
               </div>
               <div className="p-3 border-b border-rose-800/50 space-y-1">
                  <p className="text-rose-200">+ half_dim: <span className="text-slate-400">int</span></p>
                  <p className="text-rose-200">+ brain: <span className="text-slate-400">ResidualMLP</span></p>
               </div>
               <div className="p-3 space-y-1 text-slate-300">
                  <p>+ __init__(t, c, hidden)</p>
                  <p className="font-bold text-white">+ forward(θ, cond)</p>
                  <p className="font-bold text-white">+ inverse(z, cond)</p>
               </div>
            </div>

            {/* 4. ResidualMLP */}
            <div className="absolute top-[160px] left-[550px] w-[240px] bg-teal-950/40 border border-teal-500 rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.2)] z-10 flex flex-col text-[10px]">
               <div className="bg-teal-900/80 py-2 border-b border-teal-500 rounded-t-lg text-center">
                  <span className="block text-[9px] text-teal-300">&lt;&lt;neural_network&gt;&gt;</span>
                  <strong className="text-white text-xs">ResidualMLP</strong>
               </div>
               <div className="p-3 border-b border-teal-800/50 space-y-1">
                  <p className="text-teal-200">+ init_layer: <span className="text-slate-400">nn.Linear</span></p>
                  <p className="text-teal-200">+ blocks: <span className="text-slate-400">nn.ModuleList</span></p>
                  <p className="text-teal-200">+ act: <span className="text-slate-400">nn.GELU</span></p>
                  <p className="text-teal-200">+ final_layer: <span className="text-slate-400">nn.Linear</span></p>
               </div>
               <div className="p-3 space-y-1 text-slate-300">
                  <p>+ __init__(in, hid, out)</p>
                  <p className="font-bold text-white">+ forward(x)</p>
               </div>
            </div>

            {/* Annotations */}
            <div className="absolute top-[80px] left-[150px] text-[10px] text-slate-400 font-sans italic">Inherits from (Is-A)</div>
            <div className="absolute top-[285px] left-[255px] text-[9px] text-indigo-300 font-sans font-bold">1</div>
            <div className="absolute top-[285px] left-[270px] text-[9px] text-indigo-300 font-sans font-bold">*</div>
            <div className="absolute top-[260px] left-[245px] text-[9px] text-slate-400 font-sans italic text-center w-10">Aggreg.<br/>(Has-A)</div>
            <div className="absolute top-[285px] left-[525px] text-[9px] text-rose-300 font-sans font-bold">1</div>
            <div className="absolute top-[285px] left-[540px] text-[9px] text-rose-300 font-sans font-bold">1</div>
            <div className="absolute top-[260px] left-[515px] text-[9px] text-slate-400 font-sans italic text-center w-10">Compos.<br/>(Owns-A)</div>

         </div>
      </div>
      
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded text-xs text-indigo-900 shadow-sm mt-2 w-full mx-auto">
        <strong>Reading the UML:</strong> The outer Pipeline Flow manages a list of Coupling Layers. Each Coupling Layer instantiates exactly one ResidualMLP as its "Brain". Because they all inherit from <code>nn.Module</code>, calling <code>.parameters()</code> on the outer Wrapper automatically recursively finds the weights of every single MLP!
      </div>
    </div>
  );
}
