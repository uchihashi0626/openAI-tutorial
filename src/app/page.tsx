"use client";

import React, { useState, FormEvent } from "react";

interface ChatResponse {
  message?: {
    content?: string;
  };
}

export default function HomePage() {
  const [userInput, setUserInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      if (!res.ok) {
        // ステータスが200以外の場合はエラーとして扱う
        throw new Error("Request failed");
      }

      // APIからJSONを受け取り、インターフェイス ChatResponse で型を定義
      const data: ChatResponse = await res.json();
      const content = data.message?.content || "No content in response";
      setResponse(content);
    } catch (err) {
      console.error(err);
      setResponse("Error occurred. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Simple ChatGPT-like Demo (TypeScript)</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="border w-full p-2 mb-2 rounded"
          rows={4}
          placeholder="Ask me anything..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <br />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>

      {response && (
        <div className="bg-gray-100 p-4 rounded">
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </main>
  );
}
