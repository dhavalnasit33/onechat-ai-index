import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold tracking-tight">ONECHAT <span className="text-[#6C56E5]">AI</span></div>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-gray-900">Categories</a>
          <a href="#" className="hover:text-gray-900">Methodology</a>
          <a href="#" className="hover:text-gray-900">For Journalists</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            How the world is <span className="text-[#6C56E5]">actually</span> using AI.
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Track real-world trends, adoption metrics, and tool statistics across demographics and industries.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-2xl mx-auto shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C56E5] focus:border-[#6C56E5] text-lg"
              placeholder="Search for AI stats, countries, or industries..."
            />
          </div>
        </div>

        {/* TRENDING CHARTS PLACEHOLDER */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Trending Snapshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Placeholder Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-64 flex flex-col justify-center items-center text-gray-400">
              <span className="text-lg font-medium text-gray-800 mb-2">Global ChatGPT Market Share</span>
              [ Chart.js Graphic Will Go Here ]
            </div>
            {/* Placeholder Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-64 flex flex-col justify-center items-center text-gray-400">
              <span className="text-lg font-medium text-gray-800 mb-2">Gen Z Weekly Usage</span>
              [ Chart.js Graphic Will Go Here ]
            </div>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Browse Data Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['By Age Group', 'By Country', 'By Industry', 'Market Share'].map((cat) => (
              <div key={cat} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#6C56E5] hover:shadow-md cursor-pointer transition-all text-center">
                <h3 className="font-semibold text-gray-800">{cat}</h3>
                <p className="text-sm text-gray-500 mt-1">100+ Topics</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}