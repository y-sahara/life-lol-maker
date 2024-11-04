'use client'

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const HumorConverter = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const convertToHumor = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/', {  // このエンドポイントは別途実装が必要です
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 実際の実装時にはAnthropicのAPIキーを適切に設定してください
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `以下の日常の一コマをユーモアのある表現に変換してください：${input}`
            }
          ],
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          temperature: 0.7,
        })
      });

      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      console.log('Error:', error);
      setResult('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">日常をユーモアに変換！</h1>
        <p className="text-gray-600">日常の出来事を入力してください。Claudeがユーモアある表現に変換します。</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例：今日、電車で寝過ごしてしまった..."
          className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={convertToHumor}
          disabled={loading || !input.trim()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '変換中...' : '変換する'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-4">
            <MessageSquare className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Claude's ユーモア変換</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HumorConverter;