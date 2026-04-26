const supabase = require('../config/supabaseClient');

// @route   GET api/repos
// @desc    Get all user's tracked repos
exports.getRepos = async (req, res) => {
    try {
        const { data: repos, error } = await supabase
            .from('tracked_repos')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map postgres snake_case to frontend camelCase expectations
        const formattedRepos = repos.map(r => ({
            _id: r.id,
            user: r.user_id,
            repoName: r.repo_name,
            repoUrl: r.repo_url,
            language: r.language,
            status: r.status,
            notes: r.notes,
            createdAt: r.created_at
        }));
        
        res.json(formattedRepos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/repos
// @desc    Add new tracked repo
exports.addRepo = async (req, res) => {
    const { repoName, repoUrl, language, status, notes } = req.body;
    try {
        const { data: repo, error } = await supabase
            .from('tracked_repos')
            .insert([{
                repo_name: repoName,
                repo_url: repoUrl,
                language,
                status,
                notes,
                user_id: req.user.id
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({
            _id: repo.id,
            user: repo.user_id,
            repoName: repo.repo_name,
            repoUrl: repo.repo_url,
            language: repo.language,
            status: repo.status,
            notes: repo.notes,
            createdAt: repo.created_at
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/repos/:id
// @desc    Update tracked repo
exports.updateRepo = async (req, res) => {
    const { repoName, repoUrl, language, status, notes } = req.body;
    
    const repoFields = {};
    if (repoName !== undefined) repoFields.repo_name = repoName;
    if (repoUrl !== undefined) repoFields.repo_url = repoUrl;
    if (language !== undefined) repoFields.language = language;
    if (status !== undefined) repoFields.status = status;
    if (notes !== undefined) repoFields.notes = notes;

    try {
        const { data: repo } = await supabase.from('tracked_repos').select('*').eq('id', req.params.id).single();
        if (!repo) return res.status(404).json({ msg: 'Repo not found' });

        if (repo.user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { data: updatedRepo, error } = await supabase
            .from('tracked_repos')
            .update(repoFields)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({
            _id: updatedRepo.id,
            user: updatedRepo.user_id,
            repoName: updatedRepo.repo_name,
            repoUrl: updatedRepo.repo_url,
            language: updatedRepo.language,
            status: updatedRepo.status,
            notes: updatedRepo.notes,
            createdAt: updatedRepo.created_at
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   DELETE api/repos/:id
// @desc    Delete tracked repo
exports.deleteRepo = async (req, res) => {
    try {
        const { data: repo } = await supabase.from('tracked_repos').select('*').eq('id', req.params.id).single();
        if (!repo) return res.status(404).json({ msg: 'Repo not found' });

        if (repo.user_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { error } = await supabase.from('tracked_repos').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ msg: 'Repo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
