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
  const [testLoading, setTestLoading] = useState(false);
  const [challengeData, setChallengeData] = useState(null);
  const [testId, setTestId] = useState(null);
  const [studentInput, setStudentInput] = useState('');
  const [testResult, setTestResult] = useState(null);

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
    if (showTestMode && sessionStatus === 'ACTIVE' && !testId) {
      const getTest = async () => {
        try {
          setTestLoading(true);
          const res = await api.post('/test/generate', { repoName });
          setTestId(res.data.testId);
          
          let parsedData = res.data.challengeData;
          if (typeof parsedData === 'string') {
             try { parsedData = JSON.parse(parsedData); } catch (e) { console.error("Parse err", e); }
          }
          setChallengeData(parsedData);

        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || "Failed to generate test. Server error.");
        } finally {
          setTestLoading(false);
        }
      };
      getTest();
    }
  }, [showTestMode, sessionStatus, repoName, testId]);

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
    const handleTestSubmit = async () => {
      try {
        setTestLoading(true);
        const res = await api.post('/test/submit', { testId, studentAnswer: studentInput });
        setTestResult(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to submit test.");
      } finally {
        setTestLoading(false);
      }
    };

    const renderCodeBlock = () => {
      if (!challengeData || !challengeData.codeWithGaps) {
         return (
            <div className="p-4 bg-red-900 border border-red-500 text-red-200 rounded-lg shadow mt-4">
               <strong>UI Rendering Fault:</strong> The required AI Challenge payload was corrupt or missing <code>codeWithGaps</code>.
            </div>
         );
      }
      
      const parts = challengeData.codeWithGaps.split('___GAP___');
      
      return (
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center text-xs text-gray-400">
            <span>{challengeData.filename}</span>
            <span>{challengeData.language}</span>
          </div>
          <pre className="p-5 text-sm font-mono whitespace-pre-wrap text-gray-300 leading-relaxed overflow-x-auto">
            {parts[0]}
            {!testResult ? (
              <textarea
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                autoFocus
                className="mx-1 bg-gray-800 border-b-2 border-emerald-500 rounded outline-none text-emerald-400 px-2 font-mono w-full max-w-lg min-h-[80px] shadow-inner placeholder-gray-600 transition-colors focus:bg-gray-700 focus:border-emerald-400"
                placeholder="/* Replace the logic gap here */"
              />
            ) : (
               <span className={`px-2 py-1 mx-1 rounded font-bold ${testResult.score > 0 ? "bg-emerald-900 text-emerald-400 border border-emerald-500" : "bg-red-900 text-red-400 border border-red-500"}`}>
                 {studentInput}
               </span>
            )}
            {parts.length > 1 ? parts[1] : ''}
          </pre>
        </div>
      );
    };

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-emerald-600">⚡ Code Reconstruction Session:</span> {repoName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Fill in the logical gap to reconstruct the file successfully.</p>
          </div>
          <Button onClick={() => setShowTestMode(false)} variant="outline">Exit Test Mode</Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
            {error}
          </div>
        )}

        {testLoading && !testResult && !challengeData ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Gemini 1.5 Analyzing Codebase...</h3>
                <p className="text-gray-500">Injecting gaps and extrapolating architecture parameters.</p>
              </div>
            </CardContent>
          </Card>
        ) : testResult ? (
          <Card className={`border-2 ${testResult.score > 50 ? 'border-emerald-500' : 'border-red-500'} bg-white overflow-hidden shadow-lg mb-6`}>
            <div className={`h-2 w-full ${testResult.score > 50 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <CardContent className="p-8 text-center bg-gray-50/50">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${testResult.score > 50 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <span className="text-4xl">{testResult.score > 50 ? '🎉' : '❌'}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Automated Grading Result</h2>
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-gray-500 font-medium tracking-wide uppercase">Final Score:</span>
                <span className={`text-5xl font-black ${testResult.score > 50 ? 'text-emerald-500' : 'text-red-500'}`}>{testResult.score} / 100</span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-left max-w-3xl mx-auto space-y-4">
                 <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">Correct Syntax Expected</h4>
                 <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-inner">
                    {testResult.correctSnippet}
                 </div>
              </div>
            </CardContent>
          </Card>
        ) : challengeData ? (
          <div className="space-y-6">
            <Card className="border-emerald-100 shadow-emerald-100/20">
              <CardContent className="p-6">
                 <h3 className="font-bold text-lg text-emerald-800 mb-2 flex flex-row items-center justify-between">
                    <div><span className="mr-2">💡</span> Instructor's Hint</div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full uppercase tracking-widest">Active Exam</span>
                 </h3>
                 <p className="text-emerald-900/80 leading-relaxed font-medium">{challengeData.hint}</p>
              </CardContent>
            </Card>

            {renderCodeBlock()}

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
               <Button 
                onClick={handleTestSubmit} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide shadow-md px-8 py-2.5 h-auto text-lg transition-all active:scale-95" 
                disabled={!studentInput.trim() || testLoading}
               >
                 {testLoading ? 'Evaluating with UI...' : 'Submit Reconstructed Code'}
               </Button>
            </div>
          </div>
        ) : null}
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
