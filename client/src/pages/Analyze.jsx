import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export default function Analyze() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('LOCKED');
  const [showTestMode, setShowTestMode] = useState(false);

  useEffect(() => {
    let interval;
    
    const checkSession = async () => {
      try {
        const res = await api.get('/session');
        const status = res.data.status;
        setSessionStatus(status);
        
        if (status === 'ACTIVE') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to get session status', err);
      }
    };

    checkSession();
    
    interval = setInterval(() => {
       checkSession();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const analyzeRepo = async () => {
      try {
        setLoading(true);
        const res = await api.post('/github/analyze-commits', { repoName });
        setCommits(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error analyzing repository');
      } finally {
        setLoading(false);
      }
    };
    analyzeRepo();
  }, [repoName]);

  if (showTestMode && sessionStatus === 'LOCKED') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/95 backdrop-blur-sm">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mb-6 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Locked</h2>
          <p className="text-gray-600 text-base mb-6">Waiting for Teacher to Start Session...</p>
          <Button variant="outline" onClick={() => setShowTestMode(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  if (showTestMode && sessionStatus === 'ACTIVE') {
    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Test Generation: {repoName}</h1>
          <Button onClick={() => setShowTestMode(false)} variant="outline">Exit Test Mode</Button>
        </div>
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
             <div className="animate-pulse rounded-full h-16 w-16 bg-blue-100 flex items-center justify-center mb-4">
               <span className="text-2xl">🤖</span>
             </div>
             <h2 className="text-xl font-bold mb-2">Gemini Analysis Active</h2>
             <p className="text-gray-600">The teacher has started the session. AI Test Generation would begin here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analysis: {repoName}</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowTestMode(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Take AI Test
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600 font-medium animate-pulse">Scanning Repository...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits Analyzed</CardTitle>
            </CardHeader>
          </Card>
          
          {commits.map((commit) => (
            <Card key={commit.sha}>
              <CardHeader className="bg-gray-50 border-b border-gray-100 pb-3">
                <CardTitle className="text-base flex justify-between items-center">
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 mr-2">
                    {commit.sha.substring(0, 7)}
                  </span>
                  <span className="flex-1 truncate">{commit.message}</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {new Date(commit.date).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-2">Files Changed ({commit.filesChanged.length}):</h4>
                <div className="space-y-2">
                  {commit.filesChanged.map((file, idx) => (
                    <div key={idx} className="text-sm border rounded p-2 bg-gray-50">
                      <div className="flex justify-between font-mono text-xs text-gray-700 mb-1">
                        <span>{file.filename}</span>
                        <span>
                          <span className="text-green-600">+{file.additions}</span>{' '}
                          <span className="text-red-600">-{file.deletions}</span>
                        </span>
                      </div>
                      {file.patch && (
                        <pre className="text-[10px] overflow-x-auto bg-gray-800 text-gray-200 p-2 rounded mt-2">
                          {file.patch}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
