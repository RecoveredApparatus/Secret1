import React, { useState } from 'react';
import { Upload, Loader, Link } from 'lucide-react';
import { setKoboldApiUrl } from '../services/kobold';

interface NotesInputProps {
  onSubmit: (notes: { subject: string; content: string }) => Promise<void>;
}

export function NotesInput({ onSubmit }: NotesInputProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [isApiSet, setIsApiSet] = useState(false);

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiUrl) {
      setKoboldApiUrl(apiUrl);
      setIsApiSet(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiSet) {
      alert('Please set the KoboldCPP API URL first');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit({ subject, content });
      setContent('');
    } catch (error) {
      console.error('Error submitting notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => document.getElementById('notes-modal')?.showModal()}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Upload className="w-6 h-6" />
      </button>

      <dialog id="notes-modal" className="modal p-0 rounded-lg shadow-xl backdrop:bg-gray-800/50">
        <div className="w-[500px] p-6">
          {!isApiSet ? (
            <form onSubmit={handleApiSubmit} className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Set KoboldCPP API URL</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Cloudflare Tunnel URL from Colab
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://your-tunnel-url.trycloudflare.com"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <a
                  href="https://colab.research.google.com/github/lostruins/koboldcpp/blob/concedo/colab.ipynb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Link className="w-4 h-4" />
                  Open Colab Notebook
                </a>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Set API URL
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-4">Upload Your Notes</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="computer_science">Computer Science</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Notes Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-40 p-2 border rounded-lg resize-none"
                  placeholder="Paste your notes here..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('notes-modal')?.close()}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate Questions</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
}