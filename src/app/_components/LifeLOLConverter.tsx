'use client';

import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: string;
}

const LifeLOLConverter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const convertToHumor = async (): Promise<void> => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input })
      });
      
      const data: ApiResponse = await response.json();
      console.log(response)
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      if (data.choices?.[0]?.message?.content) {
        setResult(data.choices[0].message.content);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Error:', error);
      }
      setResult('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(result);
      // Optional: Add toast notification here
    } catch (error) {
      console.log('Failed to copy text:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">Life LOL Maker</h1>
        </div>
        <p className="text-gray-600">日常をユーモアに変換しましょう！</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          placeholder="例：今日、電車で寝過ごしてしまった..."
          className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-yellow-500 
            focus:border-transparent resize-none bg-white shadow-sm
            placeholder:text-gray-400"
          disabled={loading}
        />
        
        <button
          onClick={convertToHumor}
          disabled={loading || !input.trim()}
          type="button"
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg 
            hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed 
            transition-colors duration-200 font-medium shadow-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
              変換中...
            </span>
          ) : (
            '面白く変換！'
          )}
        </button>
      </div>

      {result && (
        <div className="bg-gray-50 p-6 rounded-lg border border-yellow-200 shadow-sm">
          <div className="flex items-start space-x-4">
            <MessageSquare className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 mb-2">変換結果</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleCopy}
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 
                flex items-center gap-2 transition-colors duration-200"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              結果をコピー
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center mt-4">
        ※ 生成された内容は参考程度にお楽しみください
      </div>
    </div>
  );
};

export default LifeLOLConverter;