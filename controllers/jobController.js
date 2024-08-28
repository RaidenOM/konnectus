const Job = require('../models/job')
const Alumni = require('../models/alumni')


module.exports.showJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('postedBy', 'name'); // Populate the alumni's name
    console.log(jobs);
    res.render('jobs/listJobs', { jobs });
}

module.exports.newJobForm = (req, res) => {
    res.render('jobs/createJob');
}

module.exports.showJob = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('postedBy');
    if (!job) {
        req.flash('error', 'Job not found!');
        return res.redirect('/jobs');
    }
    res.render('jobs/viewJob', { job, user: req.user});
}


module.exports.createJob = async (req, res) => {
    const { title, description, company, location } = req.body.job;
    const alumni = await Alumni.findOne({userId: req.user.id})
    console.log(alumni)
    console.log(req.user)
    const job = new Job({
        title,
        description,
        company,
        location,
        postedBy: alumni.id
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
