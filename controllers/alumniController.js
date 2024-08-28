const Alumni = require('../models/alumni')
const User = require('../models/user')

module.exports.showAlumnis = async (req, res) => {
    const alumnis = await Alumni.find({});
    res.render('alumni/listAlumni', { alumnis });
}

module.exports.newAlumniForm = (req, res) => {
    res.render('alumni/createAlumni');
}

module.exports.editAlumniForm = async (req, res) => {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);
    res.render('alumni/editAlumni', { alumni });
}

module.exports.showAlumni = async (req, res) => {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);
    res.render('alumni/showAlumni', { alumni });
}

module.exports.createAlumni = async (req, res) => {
    const { username, password, email, name, currentPosition, graduationYear, major, bio} = req.body.alumni
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    const alumni = new Alumni({createdBy: req.user.id, userId: user.id, username, currentPosition, graduationYear, major, bio, name})

    await user.save()
    await alumni.save()

    req.flash('success', 'Alumni created successfully!'); // Added flash message
    res.redirect('/alumni');
}

module.exports.deleteAlumni = async (req, res) => {
    const { id } = req.params;

    // Find the alumni by ID
    const alumni = await Alumni.findById(id);

    if (!alumni) {
        req.flash('error', 'Alumni not found');
        return res.redirect('/alumni');
    }

    // Delete the associated user
    await User.findByIdAndDelete(alumni.userId);

    // Delete the alumni
    await Alumni.findByIdAndDelete(id);

    req.flash('success', 'Alumni and associated user deleted successfully!');
    res.redirect('/alumni');
}

module.exports.updateAlumni = async (req, res) => {
    const { id } = req.params;
    await Alumni.findByIdAndUpdate(id, req.body.alumni);
    req.flash('success', 'Alumni updated successfully!'); // Added flash message
    res.redirect(`/alumni/${id}`);
}
