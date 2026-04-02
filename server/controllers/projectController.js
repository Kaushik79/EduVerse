const { Project, ProjectMember, User } = require('../models');

const projectController = {
  // Get all projects (with filtering)
  async getAll(req, res) {
    try {
      const { status, type } = req.query;
      const where = {};
      if (status) where.status = status;
      if (type) where.type = type;

      const projects = await Project.findAll({
        where,
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'avatar', 'department'] },
          { model: ProjectMember, as: 'members', include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }
          ]}
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create project
  async create(req, res) {
    try {
      const { title, description, type, techStack, maxMembers, deadline, repoUrl } = req.body;
      const project = await Project.create({
        title, description, type, techStack: JSON.stringify(techStack || []),
        maxMembers, deadline, repoUrl, ownerId: req.user.id
      });
      // Add owner as member
      await ProjectMember.create({ projectId: project.id, userId: req.user.id, role: 'owner' });
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Join project
  async join(req, res) {
    try {
      const { projectId } = req.params;
      const existing = await ProjectMember.findOne({ where: { projectId, userId: req.user.id } });
      if (existing) return res.status(400).json({ message: 'Already a member or pending' });

      const member = await ProjectMember.create({ projectId, userId: req.user.id, role: 'pending' });
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Approve member
  async approveMember(req, res) {
    try {
      const { memberId } = req.params;
      const member = await ProjectMember.findByPk(memberId, { include: [{ model: Project, as: 'project' }] });
      if (!member) return res.status(404).json({ message: 'Member not found' });
      if (member.project.ownerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

      await member.update({ role: 'member' });
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get my projects
  async getMyProjects(req, res) {
    try {
      const memberships = await ProjectMember.findAll({
        where: { userId: req.user.id },
        include: [{ model: Project, as: 'project', include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'avatar'] },
          { model: ProjectMember, as: 'members', include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }
          ]}
        ]}]
      });
      res.json(memberships.map(m => ({ ...m.project.toJSON(), myRole: m.role })));
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = projectController;
