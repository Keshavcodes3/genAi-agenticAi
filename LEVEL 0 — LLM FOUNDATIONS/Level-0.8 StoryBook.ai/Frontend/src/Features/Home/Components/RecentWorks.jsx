import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentWorks } from '../../Stories/Redux/stories.slice';

const RecentWorks = ({ limit = 10 }) => {
  const dispatch = useDispatch();
  const { recentWorks, recentWorksLoading, error } = useSelector(state => state.stories);

  useEffect(() => {
    dispatch(fetchRecentWorks(limit));
  }, [dispatch, limit]);

  if (recentWorksLoading) {
    return (
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-[#110E2C] mb-8">Recent Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-[#110E2C] mb-8">Recent Works</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error loading recent works. Please try again.
        </div>
      </div>
    );
  }

  if (!recentWorks || recentWorks.length === 0) {
    return (
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-[#110E2C] mb-8">Recent Works</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          <p>No works yet. Start creating your first story or poetry!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-gradient-to-b from-[#FAFAFE] to-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#110E2C] mb-2">
            Recent Works
          </h2>
          <p className="text-gray-600">Your latest stories and poetries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentWorks.map((work) => (
            <div
              key={work._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 group"
            >
              {/* Format Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  work.format === 'story'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {work.format === 'story' ? '📖 Story' : '✍️ Poetry'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(work.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#110E2C] mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {work.title}
              </h3>

              {/* Meta Info */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                  {work.mood}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                  {work.genre}
                </span>
              </div>

              {/* Preview Text */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[3.5rem]">
                {work.generatedText}
              </p>

              {/* Prompt */}
              <p className="text-xs text-gray-500 mb-4 line-clamp-2 italic">
                "{work.userPrompt}"
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded transition-colors text-sm">
                  View
                </button>
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 rounded transition-colors text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentWorks;
