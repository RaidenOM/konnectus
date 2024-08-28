const Job = require('../models/job')


module.exports.showJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('postedBy', 'name'); // Populate the alumni's name
    console.log(jobs);
    res.render('jobs/listJobs', { jobs });
}

module.exports.newJobForm = (req, res) => {
    res.render('jobs/createJob');
}

module.exports.showJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        req.flash('error', 'Job not found!');
        return res.redirect('/jobs');
    }
    res.render('jobs/viewJob', { job });
}


module.exports.createJob = async (req, res) => {
    const { title, description, company, location } = req.body.job;
    const job = new Job({
        title,
        description,
        company,
        location,
        postedBy: req.user.id
    });
    await job.save();
    req.flash('success', 'Job posted successfully!');
    res.redirect('/jobs');
}

module.exports.deleteJob = async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
        req.flash('error', 'Job not found!');
        return res.redirect('/jobs');
    }
    req.flash('success', 'Job deleted successfully!');
    res.redirect('/jobs');
}
