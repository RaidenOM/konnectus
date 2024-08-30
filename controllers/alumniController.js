const Alumni = require('../models/alumni');
const User = require('../models/user')
const cloudinary = require('cloudinary').v2 

const DEFAULT_PROFILE_PICTURE = 'https://res.cloudinary.com/dnltrumxv/image/upload/v1725041443/Konnectus/tmvkfcg23qv8p5lckdkz.png'

module.exports.showAlumnis = async (req, res) => {
    const alumnis = await Alumni.find({}).populate('userId');
    res.render('alumni/listAlumni', { alumnis });
}

module.exports.newAlumniForm = (req, res) => {
    res.render('alumni/createAlumni');
}

module.exports.editAlumniForm = async (req, res) => {
    const { id } = req.params;
    const alumni = await Alumni.findById(id).populate('userId');
    res.render('alumni/editAlumni', { alumni });
}

module.exports.showAlumni = async (req, res) => {
    const { id } = req.params;
    const alumni = await Alumni.findById(id).populate('userId');
    res.render('alumni/showAlumni', { alumni });
}

module.exports.createAlumni = async (req, res) => {
    console.log(req.body)
    const { username, password, email, name, currentPosition, graduationYear, major, bio} = req.body.alumni
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)

    const profilePicture = req.file ? req.file.path : null;

    //Fill profilePicture field to registeredUser
    if(profilePicture) {
        registeredUser.profilePicture = profilePicture
    }

    await registeredUser.save()
    
    const alumni = new Alumni({createdBy: req.user.id, userId: user.id, username, currentPosition, graduationYear, major, bio, name})

    await user.save()
    await alumni.save()

    req.flash('success', 'Alumni created successfully!'); // Added flash message
    res.redirect('/alumni');
}

module.exports.deleteAlumni = async (req, res) => {
    const { id } = req.params;

    // Find the alumni by ID
    const alumni = await Alumni.findById(id).populate('userId');

    if (!alumni) {
        req.flash('error', 'Alumni not found');
        return res.redirect('/alumni');
    }

    // Delete the user profile if not default
    if(alumni.userId.profilePicture != DEFAULT_PROFILE_PICTURE) {
        const publicId = alumni.userId.profilePicture.split('/').slice(7).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId); 
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
    const alumni = await Alumni.findById(id).populate('userId')
    const { name, currentPosition, graduationYear, major, bio} = req.body.alumni

    alumni.name = name
    alumni.currentPosition = currentPosition
    alumni.graduationYear = graduationYear
    alumni.major = major
    alumni.bio = bio

    const profilePicture = req.file ? req.file.path : null

    if(profilePicture) {
        alumni.userId.profilePicture = profilePicture
    }

    alumni.userId.save()
    alumni.save()

    req.flash('success', 'Alumni updated successfully!'); // Added flash message
    res.redirect(`/alumni/${id}`);
}
