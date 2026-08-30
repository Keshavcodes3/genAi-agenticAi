import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalStats } from '../../Stories/Redux/stories.slice';

const StatsSection = () => {
  const dispatch = useDispatch();
  const { totalStats, statsLoading, error } = useSelector(state => state.stories);

  useEffect(() => {
    dispatch(fetchTotalStats());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 px-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Stories */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Stories</h3>
              <span className="text-3xl">📖</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {totalStats?.totalStories || 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">Stories created</p>
          </div>

          {/* Total Poems */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Poetries</h3>
              <span className="text-3xl">✍️</span>
            </div>
            <p className="text-4xl font-bold text-purple-600">
              {totalStats?.totalPoems || 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">Poems created</p>
          </div>

          {/* Total Creations */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-md p-6 border border-pink-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-4xl font-bold text-pink-600">
              {totalStats?.totalCreations || 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">Total creations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
