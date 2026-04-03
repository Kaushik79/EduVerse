import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export default function Analyze() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analysis: {repoName}</h1>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
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
