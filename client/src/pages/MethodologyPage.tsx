import { Check, X, Shield, Search, ArrowRight, Info, Lightbulb, Users, Cpu, Eye, SlidersHorizontal } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Transparent Methodology
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            How Our Resume Evaluation
            <span className="block text-indigo-600">Actually Works</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Designed to mirror how recruiters actually hire—not to create anxiety with arbitrary scores.
          </p>
        </div>
      </header>

      <section className="py-12 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                <Info className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Our Approach</h2>
                <p className="text-slate-600">
                  We intentionally separate <strong>eligibility</strong>, <strong>discoverability</strong>, and <strong>optimization</strong> to avoid misleading candidates or encouraging gaming behavior. Each serves a distinct purpose in the hiring process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">What We Model Accurately</h2>
            <p className="mt-3 text-lg text-slate-600">Based on how enterprise ATS platforms and recruiters actually operate</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-amber-500 rounded-xl text-white">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">ATS as a Gate, Not a Ranker</h3>
                  <p className="text-slate-600 mt-1">Enterprise ATS platforms do not rank candidates by a single match score. They parse, filter, and support recruiter workflows.</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Parse resumes into structured fields</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Apply knockout criteria (required qualifications)</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Support recruiter search and filtering</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Do NOT rank candidates by semantic similarity</span></li>
              </ul>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-indigo-600" />
                  <p className="text-sm text-indigo-800">Our system reflects this with PASS / FAIL gating for ATS compatibility — not an arbitrary percentage.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-indigo-500 rounded-xl text-white">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Recruiter Search Behavior</h3>
                  <p className="text-slate-600 mt-1">Recruiters find candidates through specific search patterns, not AI matching scores.</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Job titles and seniority levels</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Core skills and technologies</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Years of experience</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Tools, domains, and industry keywords</span></li>
              </ul>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-indigo-600" />
                  <p className="text-sm text-indigo-800">We model this with a Search Status that reflects discoverability — not resume quality or hiring probability.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-violet-500 rounded-xl text-white">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Optimization as Optional Polish</h3>
                  <p className="text-slate-600 mt-1">Wording alignment matters — but only after eligibility and visibility are met.</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Checks if you speak the same language as the job description</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Only matters once you are already qualified</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>Clearly labeled as optional polish</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span>We tell you when to stop optimizing</span></li>
              </ul>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-800">Once you pass the gate and get found, small wording differences rarely matter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How We're Different</h2>
            <p className="mt-3 text-lg text-slate-600">We refuse to use fear-based tactics. Here's the difference.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="font-bold text-red-900 mb-6 text-lg">❌ The Industry Standard</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-1">The Black Box Score</h4>
                  <p className="text-sm text-red-700">Grades you on an arbitrary 0-100% "match score" that implies automatic rejection.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-1">Keyword Stuffing</h4>
                  <p className="text-sm text-red-700">Encourages jamming in hidden keywords or awkward phrasing to "trick" the AI.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-1">False Rejection</h4>
                  <p className="text-sm text-red-700">Rejects candidates based on wording similarity rather than actual skills.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-1">The "Robot" Myth</h4>
                  <p className="text-sm text-red-700">Implies the computer makes the hiring decision.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-6 text-lg">✅ Our Approach</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-1">The Eligibility Check</h4>
                  <p className="text-sm text-emerald-700">Pass/Fail criteria based on hard requirements—just like an actual ATS.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-1">Human Readability</h4>
                  <p className="text-sm text-emerald-700">Structured data so ATS can read it, clarity so recruiters want to read it.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-1">Discoverability</h4>
                  <p className="text-sm text-emerald-700">Checks if your skills are visible to search filters, regardless of phrasing.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-1">The Human Reality</h4>
                  <p className="text-sm text-emerald-700">The ATS is just a filing cabinet—recruiters make the decisions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why This Approach Matters</h2>
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-red-50 border border-red-100">
                  <h3 className="font-semibold text-red-900 mb-3">Most resume tools unintentionally:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><X className="w-5 h-5 text-red-500 mt-0.5" /><span className="text-red-800">Overstate ATS intelligence</span></li>
                    <li className="flex items-start gap-2"><X className="w-5 h-5 text-red-500 mt-0.5" /><span className="text-red-800">Create anxiety around minor wording differences</span></li>
                    <li className="flex items-start gap-2"><X className="w-5 h-5 text-red-500 mt-0.5" /><span className="text-red-800">Encourage endless resume tweaking</span></li>
                    <li className="flex items-start gap-2"><X className="w-5 h-5 text-red-500 mt-0.5" /><span className="text-red-800">Conflate optimization with qualification</span></li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-3">Our goal is to:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span className="text-emerald-800">Improve candidate confidence</span></li>
                    <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span className="text-emerald-800">Reduce false negatives</span></li>
                    <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span className="text-emerald-800">Encourage application once requirements are met</span></li>
                    <li className="flex items-start gap-2"><Check className="w-5 h-5 text-emerald-500 mt-0.5" /><span className="text-emerald-800">Reflect how recruiters actually work</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border border-indigo-100">
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">Parse and Validate</h4>
                      <span className="text-xs px-2 py-0.5 bg-amber-500 text-white rounded-full">GATE</span>
                    </div>
                    <p className="text-sm text-slate-600">Can your resume be read by ATS systems?</p>
                  </div>
                </div>
                <div className="flex justify-start pl-9"><div className="w-0.5 h-4 bg-slate-300"></div></div>
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">Assess Visibility</h4>
                      <span className="text-xs px-2 py-0.5 bg-indigo-500 text-white rounded-full">SEARCH</span>
                    </div>
                    <p className="text-sm text-slate-600">Will recruiters find you when searching?</p>
                  </div>
                </div>
                <div className="flex justify-start pl-9"><div className="w-0.5 h-4 bg-slate-300"></div></div>
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">Suggest Optimization</h4>
                      <span className="text-xs px-2 py-0.5 bg-violet-500 text-white rounded-full">OPTIONAL</span>
                    </div>
                    <p className="text-sm text-slate-600">Optional polish once the above are met</p>
                  </div>
                </div>
                <div className="flex justify-start pl-9"><div className="w-0.5 h-4 border-l-2 border-dashed border-slate-300"></div></div>
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">4</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">Human Decision</h4>
                      <span className="text-xs px-2 py-0.5 bg-emerald-500 text-white rounded-full">HUMAN</span>
                    </div>
                    <p className="text-sm text-slate-600">Recruiters still make hiring decisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">The Bottom Line</h2>
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <blockquote className="text-xl text-slate-200 leading-relaxed">
              We built a system to help you <span className="text-indigo-400 font-medium">get hired</span>, not to help you beat a bot.
              <br /><br />
              We ensure you pass the gate and get found—so a human recruiter can see how great you are.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex p-3 bg-slate-100 rounded-xl mb-3"><Shield className="w-6 h-6 text-slate-600" /></div>
              <h3 className="font-medium text-slate-900">Transparent</h3>
              <p className="text-sm text-slate-500">Full methodology disclosure</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-slate-100 rounded-xl mb-3"><Users className="w-6 h-6 text-slate-600" /></div>
              <h3 className="font-medium text-slate-900">Recruiter-Informed</h3>
              <p className="text-sm text-slate-500">Based on real workflows</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-slate-100 rounded-xl mb-3"><Eye className="w-6 h-6 text-slate-600" /></div>
              <h3 className="font-medium text-slate-900">No Black Box</h3>
              <p className="text-sm text-slate-500">Every score explained</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-slate-100 rounded-xl mb-3"><Lightbulb className="w-6 h-6 text-slate-600" /></div>
              <h3 className="font-medium text-slate-900">Honest Guidance</h3>
              <p className="text-sm text-slate-500">We tell you when to stop</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to see how your resume performs?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Get an honest check. No anxiety. No black boxes.
          </p>
          <a href="/analyze" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Analyze Your Resume
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
