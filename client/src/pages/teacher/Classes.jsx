import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function TeacherClasses() {
  return (
    <div>
      <Topbar title="Classes" subtitle="Manage your classes and sections" showSearch={false} />
      <Card>
        <CardHeader>
          <CardTitle>Your Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Classes management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
